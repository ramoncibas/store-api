import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

import UserRepository from 'repositories/UserRepository';
import UserFile from '../User/UserFile';
import UserError from 'errors/UserError';
import { CustomRequest, User, UserLogin, UserPicture } from 'types/User.type';

class AuthController {
  private static JWT_TOKEN_KEY: string;
  private static JWT_EXPIRE_IN: string;

  // Implementar a logica de revoked token com o banco de dados
  static invalidTokens: Set<string> = new Set();

  static initialize(): void {
    this.initializeJwtConfig();
  }

  private static initializeJwtConfig(): void {
    this.JWT_TOKEN_KEY = process.env.JWT_TOKEN_KEY || '';
    this.JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN || '';

    if (!this.JWT_TOKEN_KEY) {
      throw new Error("JWT_TOKEN_KEY not defined");
    }

    if (!this.JWT_EXPIRE_IN) {
      throw new Error("JWT_EXPIRE_IN not defined");
    }
  }
  
  private static generateToken = (userId: string | number, email: string): string => {
    return jwt.sign(
      { user_id: userId, email },
      this.JWT_TOKEN_KEY,
      { expiresIn: this.JWT_EXPIRE_IN }
    );
  }

  static async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: UserLogin = req.body;

      if (!email || !password) {
        res.status(400).send("All input is required");
        return;
      }

      const user: User | null = await UserRepository.getByPattern('email', email);

      if (user && user.id && (await bcrypt.compare(password, user.password))) {
        const token = AuthController.generateToken(user.id, email);

        user.token = token;
        user.expiresIn = AuthController.JWT_EXPIRE_IN;

        res.status(200).json(user);
      } else {
        res.status(400).send("Invalid Credentials");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong during login");
      throw new UserError("Something went wrong during login", error, 500);
    }
  }

  static async registerUser(req: CustomRequest, res: Response): Promise<void> {
    try {
      const {
        first_name,
        last_name,
        email,
        password,
        phone = '',
        type = 'user'
      }: User = req.body;

      const userPictureFile: UserPicture | null = req.files;

      if (Object.values(req.body).some(value => typeof value !== 'string' || value.trim() === '')) {
        res.status(400).send(UserError.invalidInput().toResponseObject());
        return;
      }

      const existingUser = await UserRepository.getByPattern('email', email);

      if (existingUser) {
        res.status(409).send("User Already Exists. Please Login");
        return;
      }

      const userUUID = randomUUID();

      if (userPictureFile && userPictureFile.user_picture) {
        await UserFile.saveUserPicture(userUUID, userPictureFile.user_picture);
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const user_picture_name: string | null = userPictureFile?.user_picture
        ? `${userUUID}_${userPictureFile.user_picture.name}`
        : null;

      const user = await UserRepository.create({
        uuid: userUUID,
        first_name,
        last_name,
        email: email.toLowerCase(),
        password: encryptedPassword,
        phone,
        user_picture_name: user_picture_name,
        type
      });

      if(user && user.id) {
        const token = AuthController.generateToken(user.id, email);

        user.token = token;
        res.status(201).json(user);
      } else {
        res.status(400).send("Token not created").send("/login");
      }

    } catch (error: any) {
      const createUserError = new UserError('Error creating user', error);

      res.status(500).send(createUserError.toResponseObject());
      throw createUserError;
    }
  }

  static async logoutUser(req: Request, res: Response): Promise<void> {
    try {
      const userToken = req.headers["x-access-token"] as string;

      if (!userToken) {
        res.status(401).send("Unauthorized");
        return;
      }

      if (AuthController.invalidTokens.has(userToken)) {
        res.status(200).send("User already logged out");
        return;
      }

      try {
        const decodedToken = jwt.verify(userToken, AuthController.JWT_TOKEN_KEY) as JwtPayload;

        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
          throw new Error('Token expired');
        }

        // Futuro: Atualizar dados do usuário na sessão, para mostrar a quantidade de usuarios logados
        // const updatedUser = await UserRepository.updateUserSession(decodedToken.user_id, /* novos dados */);

        // Futuro: Registrar atividade do usuário
        // await ActivityLogger.logUserActivity(decodedToken.user_id, 'logout');

        AuthController.invalidTokens.add(userToken);
        res.status(200).send("User successfully logged out");

      } catch (error) {
        console.error(error);
        res.status(401).send("Invalid or expired token");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong during logout");
      throw new UserError("Something went wrong during logout", error, 500);
    }
  }
}

export default AuthController;

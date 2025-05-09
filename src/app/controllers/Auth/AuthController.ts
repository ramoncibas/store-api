import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';

import UserRepository from 'repositories/UserRepository';
import UserFile from '../User/UserFile';
import { UserError } from 'builders/errors';
import { ResponseBuilder } from 'builders/response';
import { CustomRequest, User, UserLogin, UserPicture } from '@types';

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
        throw UserError.invalidInput();
      }

      const user: User | null = await UserRepository.findByEmail(email);

      if (!(user && user.id && (await bcrypt.compare(password, user.password)))) {
        throw UserError.invalidInput();
      }

      const token = AuthController.generateToken(user.id, email);

      user.token = token;
      user.expiresIn = AuthController.JWT_EXPIRE_IN;

      const paginator = user.type === 'admin' ? '/admin' : '/';

      ResponseBuilder.send({
        response: res,
        message: "User logged in successfully!",
        statusCode: 200,
        data: user,
        paginator
      });
    } catch (error: any) {
      UserError.handleError(res, error);
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

      // Alterar isso para o schema
      if (Object.values(req.body).some(
        value => typeof value !== 'string' || value.trim() === ''
      )) {
        throw UserError.invalidInput();
      }

      const existingUser = await UserRepository.findByEmail(email);

      if (existingUser) {
        throw UserError.alreadyExists();
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
        first_name,
        last_name,
        email,
        password: encryptedPassword,
        phone,
        user_picture_name: user_picture_name,
        type
      });

      if (!(user && user.id)) {
        throw UserError.creationFailed();
      }

      const token = AuthController.generateToken(user.id, email);

      user.token = token;

      ResponseBuilder.send({
        response: res,
        message: "User registered successfully!",
        statusCode: 201,
        data: user
      });

    } catch (error: any) {
      UserError.handleError(res, error);
    }
  }

  static async logoutUser(req: Request, res: Response): Promise<void> {
    try {
      const userToken = req.headers["x-access-token"] as string;

      if (!userToken) {
        throw UserError.unauthorized();
      }

      if (AuthController.invalidTokens.has(userToken)) {
        throw UserError.alreadyLogged();
      }

      try {
        const decodedToken = jwt.verify(userToken, AuthController.JWT_TOKEN_KEY) as JwtPayload;

        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
          throw UserError.invalidToken();
        }

        // Futuro: Atualizar dados do usuário na sessão, para mostrar a quantidade de usuarios logados
        // const updatedUser = await UserRepository.updateUserSession(decodedToken.user_id, /* novos dados */);

        // Futuro: Registrar atividade do usuário
        // await ActivityLogger.logUserActivity(decodedToken.user_id, 'logout');

        AuthController.invalidTokens.add(userToken);
        ResponseBuilder.send({
          response: res,
          message: "User successfully logged out!",
          statusCode: 200,
          paginator: '/'
        });
      } catch (error) {
        throw UserError.default();
      }
    } catch (error: any) {
      UserError.handleError(res, error);
    }
  }
}

export default AuthController;

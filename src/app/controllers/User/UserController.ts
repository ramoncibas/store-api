import { NextFunction, Request, Response } from 'express';
import UserRepository from 'repositories/UserRepository';
import UserFile from './UserFile';
import UserError from 'errors/UserError';
import { CustomRequest, User } from 'types/User.type';
import { FileArray, UploadedFile } from 'express-fileupload';

import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { JWT_TOKEN_KEY, BUCKET_USER_PICTURE } = process.env;

class UserController {
  static async getUser(req: Request, res: Response): Promise<void> {
    const { uuid } = req.params;

    try {
      const user = await UserRepository.getByPattern('uuid', uuid);

      if (!user) {
        const notFoundError = new UserError('User not found!', undefined, 404);
        res.status(404).send(notFoundError.toResponseObject());
        return;
      }

      if (user?.user_picture_name) {
        const filePath = `${process.env.HOST}/profile/user_picture/${user.user_picture_name}`;
        user.user_picture_url = filePath;
      }

      res.send(user);

    } catch (error: any) {
      const genericError = new UserError('Error retrieving user');

      res.status(500).send(genericError.toResponseObject());
      throw genericError;
    }
  }

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserRepository.getAll();
      res.send(users);

    } catch (error: any) {
      const genericError = new UserError('Error retrieving all user');

      res.status(500).send(genericError.toResponseObject());
      throw genericError;
    }
  }

  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const {
        first_name,
        last_name,
        email,
        password,
      }: User = req.body;

      const files = req.files as { user_picture?: FileArray | UploadedFile } || null;

      if (Object.values(req.body).some(value => typeof value !== 'string' || value.trim() === '')) {
        const invalidDataError = new UserError('All fields must be filled!', undefined, 400);
        res.status(400).send(invalidDataError.toResponseObject());
        return;
      }

      const existingUser = await UserRepository.getByPattern('email', email);

      if (existingUser) {
        res.status(409).send("User Already Exists. Please Login");
        return;
      }

      const userUUID = randomUUID();

      if (files && files.user_picture) {
        await UserFile.saveUserPicture(userUUID, files.user_picture);
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const user_picture_name: string | null = files?.user_picture
        ? `${userUUID}_${files.user_picture.name}`
        : null;

      const user = await UserRepository.create({
        uuid: userUUID,
        first_name,
        last_name,
        email: email.toLowerCase(),
        password: encryptedPassword,
        user_picture_name: user_picture_name
      });

      const token = jwt.sign(
        { user_id: user.id, email },
        JWT_TOKEN_KEY!,
        { expiresIn: "1h" }
      );

      user.token = token;
      console.log(user);
      res.status(201).json(user);

    } catch (error: any) {
      const createUserError = new UserError('Error creating user', error);

      res.status(500).send(createUserError.toResponseObject());
      throw createUserError;
    }
  }

  static async updateUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    const { phone, email, user_picture_name } = req.body;
    const userPictureFile = Array.isArray(req.files)
      ? req.files.find((file) => file.name === 'user_picture')
      : undefined;

    try {
      const userUUID = req.params.uuid;

      if (userPictureFile) {
        await UserFile.saveUserPicture(userUUID, userPictureFile);
      }

      const fields = {
        phone,
        email,
        user_picture_name: userPictureFile?.filename || user_picture_name || null
      };

      await UserRepository.update(userUUID, fields);

      res.status(200).send({
        type: "success",
        title: "Success",
        message: "Your profile has been updated!"
      });
    } catch (error: any) {
      const updateUserError = new UserError('Error updating user', error);

      res.status(500).send(updateUserError.toResponseObject());
      throw updateUserError;
    }
  }
}

export default UserController;

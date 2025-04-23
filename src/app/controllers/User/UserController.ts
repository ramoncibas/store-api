import { NextFunction, Request, Response } from 'express';
import UserRepository from 'repositories/UserRepository';
import UserFile from './UserFile';
import { UserError } from 'builders/errors';
import { ResponseBuilder } from 'builders/response';
import { CustomRequest, User, UserPicture } from '@types';

class UserController {
  static async get(req: Request, res: Response): Promise<void> {
    const { uuid } = req.params;

    try {
      const user = await UserRepository.findByUUID(uuid);

      if (!user) {
        throw UserError.notFound();
      }

      if (user?.user_picture_name) {
        const filePath = `${process.env.HOST}/profile/user_picture/${user.user_picture_name}`;
        user.user_picture_url = filePath;
      }

      return ResponseBuilder.send({
        response: res,
        message: "User retrieved successfully!",
        statusCode: 200,
        data: user
      });
    } catch (error: any) {
      UserError.handleError(res, error);
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users: User[] = await UserRepository.getAll();

      if (!users) {
        throw UserError.notFound();
      }

      return ResponseBuilder.send({
        response: res,
        message: "Users retrieved successfully!",
        statusCode: 200,
        data: users
      });
    } catch (error: any) {
      UserError.handleError(res, error);
    }
  }

  static async update(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userUUID: string = req.params.uuid;
      const { user_picture }: any = req.files || {};
      const { email, phone } = req.body;

      const user = await UserRepository.findByUUID(userUUID);
      
      if (!user) {
        throw UserError.notFound();
      }

      const fields: Record<string, any> = {};
      
      if (phone !== undefined) fields.phone = phone;

      if (email) {
        if (email !== user.email) {
          const userWithEmail = await UserRepository.findByEmail(email);

          if (userWithEmail && userWithEmail.uuid !== userUUID) {
            throw UserError.conflict("Email is already in use by another user");
          }

          fields.email = email;
        }
      }

      if (user_picture) {
        // TODO: colocar isso no middleware
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(user_picture.mimetype)) {
          throw UserError.badRequest("Invalid file type. Only JPEG, PNG and GIF are allowed.");
        }

        await UserFile.saveUserPicture(userUUID, user_picture); 

        fields.user_picture_name = user_picture.name;
      } else if (user_picture?.name !== undefined) {
        fields.user_picture_name = user_picture.name;
      }

      const hasFieldsToUpdate = Object.keys(fields).length > 0;

      if (!hasFieldsToUpdate) {
        throw UserError.updateFailed();
      }

      await UserRepository.update(userUUID, fields);

      return ResponseBuilder.send({
        response: res,
        message: "User profile has been updated!",
        statusCode: 200
      });
    } catch (error: any) {
      UserError.handleError(res, error);
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const userUUID: string = req.params.uuid;
      const user = await UserRepository.findByUUID(userUUID);

      if (!user) {
        throw UserError.notFound();
      }

      const userDeleted = await UserRepository.delete(user.uuid);

      if (!userDeleted) {
        throw UserError.deletionFailed();
      }

      ResponseBuilder.send({
        response: res,
        message: "User deleted successfully!",
        statusCode: 200
      });
    } catch (error: any) {
      UserError.handleError(res, error);
    }
  }
}

export default UserController;

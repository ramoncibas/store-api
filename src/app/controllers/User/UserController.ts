import { NextFunction, Request, Response } from 'express';
import UserRepository from 'repositories/UserRepository';
import UserFile from './UserFile';
import UserError from 'builders/errors/UserError';
import ResponseBuilder from 'builders/response/ResponseBuilder';
import { CustomRequest, User, UserPicture } from 'types/User.type';

class UserController {
  static async getUser(req: Request, res: Response): Promise<void> {
    const { uuid } = req.params;

    try {
      const user = await UserRepository.search('uuid', uuid);

      if (!user) {
        throw UserError.userNotFound();
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

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users: User[] = await UserRepository.getAll();

      if (!users) {
        throw UserError.userNotFound();
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

  static async updateUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    const { phone, email, user_picture_name } = req.body;
    const userPictureFile: UserPicture | null = req.files;

    try {
      const userUUID: string = req.params.uuid;

      if (userPictureFile && userPictureFile.user_picture) {
        await UserFile.saveUserPicture(userUUID, userPictureFile);
      }

      const fields = {
        phone,
        email,
        user_picture_name: userPictureFile?.user_picture?.name || user_picture_name || null
      };

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
}

export default UserController;

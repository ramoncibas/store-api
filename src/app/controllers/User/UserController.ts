import { NextFunction, Request, Response } from 'express';
import UserRepository from 'repositories/UserRepository';
import UserFile from './UserFile';
import UserError from 'errors/UserError';
import { CustomRequest, User, UserPicture } from 'types/User.type';

class UserController {
  static async getUser(req: Request, res: Response): Promise<void> {
    const { uuid } = req.params;

    try {
      const user = await UserRepository.getByPattern('uuid', uuid);

      if (!user) {
        res.status(404).send(UserError.userNotFound().toResponseObject());
        return;
      }

      if (user?.user_picture_name) {
        const filePath = `${process.env.HOST}/profile/user_picture/${user.user_picture_name}`;
        user.user_picture_url = filePath;
      }

      res.send(user);

    } catch (error: any) {
      res.status(500).send(UserError.default().toResponseObject());
      throw UserError.default();
    }
  }

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users: User[] = await UserRepository.getAll();
      
      res.send(users);
    } catch (error: any) {
      res.status(500).send(UserError.default().toResponseObject());
      throw UserError.default();
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

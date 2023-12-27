import { Request, Response } from 'express';
import findUserBy from '../../../models/User/findUserBy';
import UserModel from './UserModel';
import UserFile from './UserFile';
import { User } from '../../types/User.type';

interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

class UserController {
  static async getUser(req: Request, res: Response): Promise<void> {
    const { uuid } = req.params;

    try {
      const findUser = new findUserBy();
      const [userProfile] = await findUser.uuid(uuid) as Array<User>;

      if (userProfile.user_picture_name) {
        const filePath = `${process.env.HOST}/profile/user_picture/${userProfile.user_picture_name}`;
        userProfile.user_picture_url = filePath;
      }

      res.send(userProfile);
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong, Select All Products");
    }
  }

  static async getAllUser(req: Request, res: Response): Promise<void> {
    // Lógica para obter todos os usuários
    const id = req.params.id;
    try {
      // Code...
    } catch (error) {
      console.log(error);
      res.send("Something went wrong, Select All Users");
    }
  }

  static async saveUser(req: Request, res: Response): Promise<void> {
    // Lógica para salvar um novo usuário
    const fields = req.body;
    console.log(fields);

    if (Object.values(fields).some(value => typeof value !== 'string' || value.trim() === '')) {
      res.status(400).send("Todos os campos devem ser preenchidos!");
      return;
    }

    try {
      await UserModel.saveUser(fields);
      res.status(201).redirect("/profile");      
    } catch (error) {
      console.log(error);
      res.send("Something went wrong, SaveUser");
    }
  }

  static async updateUser(req: MulterRequest, res: Response): Promise<void> {
    // Lógica para atualizar informações do usuário
    const { phone, email, user_picture_name } = req.body;

    const userPictureFile = req.files.find(file => file.fieldname === 'user_picture');

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

      await UserModel.updateUser(userUUID, fields);

      res.status(200).send({
        type: "success",
        title: "Sucesso",
        message: "O seu perfil foi atualizado!"
      });

    } catch (error) {
      console.error('Error updating user:', error);

      res.status(500).send({
        type: "error",
        title: "Falhou",
        message: "Parece que algo deu errado!"
      });
    }
  }
}

export default UserController;

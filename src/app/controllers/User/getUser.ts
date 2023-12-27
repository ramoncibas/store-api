import { Request, Response } from 'express';
import findUserBy from '../../../models/User/findUserBy';

/** 
 * Pega informações do usuário
 * @param {Request} req - O objeto de requisição
 * @param {Response} res - O objeto de resposta
 * @returns {void} - A função envia a resposta diretamente
 */
const getUser = async (req: Request, res: Response): Promise<void> => {
  const { uuid } = req.params;

  try {
    const findUser = new findUserBy();
    // const [userProfile] = await findUser.uuid(uuid) as Array<{}>;
    const [userProfile] = await findUser.uuid(uuid) as Array<any>;

    if (userProfile.user_picture_name) {
      const filePath = `${process.env.HOST}/profile/user_picture/${userProfile.user_picture_name}`;
      userProfile.user_picture_url = filePath;
    }

    res.send(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong, Select All Products");
  }
};

export default getUser;

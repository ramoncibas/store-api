import fs from "fs";
import path from "path";
import { doesFileExist } from "utils";

const { BUCKET_USER_PICTURE = '' } = process.env;

class UserFile {
  static async deleteUserPicture(userPicture: string): Promise<void> {
    try {
      if (userPicture) {
        await fs.promises.unlink(userPicture);
      }
    } catch (error) {
      console.error('Error deleting user picture:', error);
    }
  }

  static async saveUserPicture(userUUID: string, userPicture: any): Promise<void> {
    const pictureName = `${userUUID}_${userPicture.name}`;
    const picturePath = path.join(BUCKET_USER_PICTURE, pictureName);

    const userPictureExist = await doesFileExist(userUUID, BUCKET_USER_PICTURE);

    if (userPictureExist) {
      const picturePathToDelete = path.join(BUCKET_USER_PICTURE, userPictureExist);
      await UserFile.deleteUserPicture(picturePathToDelete);
    }

    // userPicture.mv(picturePath, (error: any) => {
    //   if (error) {
    //     return `Erro ao salvar a imagem: ${error}`;
    //   }
    // });

    await fs.promises.writeFile(picturePath, userPicture.data);
  }
}

export default UserFile;

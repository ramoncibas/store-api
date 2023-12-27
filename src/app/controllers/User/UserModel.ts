import Database from "../../config/db";
import saveUserModel from "models/User/saveUserModel";  // Migrar o que já tem para repository, e criar o que não tem
import updateUserModel from "models/User/updateUser";
import getUserModel from "models/User/getUserModel";

class UserModel {
  static async saveUser(fields: any): Promise<void> {
    // Lógica para salvar o usuário no banco de dados
    await saveUserModel(Database, fields);
  }

  static async updateUser(userUUID: string, fields: any): Promise<void> {
    // Lógica para atualizar o usuário no banco de dados
    await updateUserModel(Database, userUUID, fields);
  }

  static async getUser(userUUID: string, fields: any): Promise<void> {
    // Lógica para atualizar o usuário no banco de dados
    await getUserModel(Database, userUUID, fields);
  }
}

export default UserModel;

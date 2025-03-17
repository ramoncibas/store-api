// import BaseModel from "models/BaseModel"; // Supondo que você tenha uma classe Model base
// import GenericError from "builders/errors/GenericError";

// abstract class BaseRepository<T> {
//   protected model: BaseModel<T>;

//   constructor(model: BaseModel<T>) {
//     this.model = model;
//   }

//   /**
//    * Creates a new record in the database.
//    * @param data - Object representing the data to be created.
//    * @returns A Promise that resolves with the created record.
//    */
//   async create(data: Omit<T, "id" | "uuid">): Promise<T> {
//     try {
//       return await this.model.save(data);
//     } catch (error: any) {
//       throw GenericError.defaultMessage();
//     }
//   }

//   /**
//    * Gets a record from the database based on the provided ID or UUID.
//    * @param id - ID or UUID of the record.
//    * @returns A Promise that resolves with the record data or null if not found.
//    */
//   async get(id: string): Promise<any | null> {
//     try {
//       return await this.model.get(id);
//     } catch (error: any) {
//       // throw new AppError('Error retrieving record', error);
//       console.log(error);
//     }
//   }

//   /**
//    * Updates the data of a record in the database.
//    * @param id - ID or UUID of the record to be updated.
//    * @param updatedFields - Object containing the fields to be updated.
//    * @returns A Promise that resolves with the updated record.
//    */
//   async update(id: string, updatedFields: Partial<T>): Promise<any> {
//     try {
//       return await this.model.update(id, updatedFields);
//     } catch (error: any) {
//       console.log(error);
//     }
//   }

//   /**
//    * Deletes a record from the database based on the provided ID or UUID.
//    * @param id - ID or UUID of the record to be deleted.
//    * @returns A Promise that resolves with a boolean indicating success.
//    */
//   async delete(id: string): Promise<any> {
//     try {
//       return await this.model.delete(id);
//     } catch (error: any) {
//       console.log(error);
//     }
//   }
// }

// export default BaseRepository;
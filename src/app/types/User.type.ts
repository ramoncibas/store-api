import { Request, Response } from 'express';
import { FileArray, UploadedFile } from 'express-fileupload';
import { Email, Phone } from 'domain/entities';

export type UserType = 'user' | 'admin';

export interface UserLogin {
  email: string;
  password: string;
}

export interface User extends UserLogin {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  phone?: string;
  user_picture_name: string | null;
  user_picture_url?: string;
  expiresIn?: any;
  token?: string;
  type?: UserType;
}

export interface UserPicture {
  name: any;
  user_picture?: FileArray | UploadedFile 
}

export interface CustomRequest extends Request {
  // files?: ({ [name: string]: UploadedFile } & FileArray) | null | undefined;
  files?: any;
  user?: any;
}

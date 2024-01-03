import { Request, Response } from 'express';
import { FileArray, UploadedFile } from 'express-fileupload';
import { AuthRequest } from '../middlewares/authMiddleware';

export type UserType = 'user' | 'admin';

export interface UserLogin {
  email: string;
  password: string;
}

export interface User extends UserLogin {
  id?: number | string;
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

export interface CustomRequest extends Request {
  // files?: ({ [name: string]: UploadedFile } & FileArray) | null | undefined;
  files?: any;
  user?: any;
}

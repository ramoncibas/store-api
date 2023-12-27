type UserType = 'user' | 'admin';

export interface UserLogin {
  email: string;
  password: string;
}

export interface User extends UserLogin {
  id?: number;
  uuid: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_picture_name: string;
  user_picture_url?: string;
  expiresIn?: any;
  token: string;
  type: UserType;
}
import { Request, Response, NextFunction } from "express";
import UserRepository from "repositories/UserRepository";
import { UserError } from "builders/errors";
import { User } from "@types";

const AuthAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userId: number | undefined = Number(req.user?.id) as number;

  if (!userId) {
    throw UserError.unauthorized();
  }
  
  try {
    const user: User | null = await UserRepository.findById(userId);

    if(user && user?.type != 'admin') {
      console.log(user)
      throw UserError.unauthorized();
    }

    return next();
  } catch (error) {
    UserError.handleError(res, error);
  }
};

export default AuthAdmin;
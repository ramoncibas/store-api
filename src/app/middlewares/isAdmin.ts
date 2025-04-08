import { Request, Response, NextFunction } from "express";
import UserRepository from "repositories/UserRepository";
import { UserError } from "builders/errors";
import { User } from "@types";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const uuid: number | undefined = Number(req.headers["user-uuid"]) as number;

  const messageWrongUser: string = "Ops! You are not able to acces this page";

  if (!uuid) {
    return res.status(403).send(messageWrongUser);
  }
  
  try {
    const user: User | null = await UserRepository.findByUserID(uuid);

    if(user && user?.type != 'admin') {
      throw UserError.unauthorized();
    }

    return next();
  } catch (error) {
    UserError.handleError(res, error);
  }
};

export default isAdmin;
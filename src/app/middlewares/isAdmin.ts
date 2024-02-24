import { Request, Response, NextFunction } from "express";
import UserRepository from "repositories/UserRepository";
import UserError from "builders/errors/UserError";
import { User } from "types/User.type";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const uuid: string | undefined = req.headers["user-uuid"] as string;

  const messageWrongUser: string = "Ops! You are not able to acces this page";

  if (!uuid) {
    return res.status(403).send(messageWrongUser);
  }
  
  try {
    const user: User | null = await UserRepository.search('uuid', uuid);

    if(user && user?.type != 'admin') {
      return res.status(403).send(messageWrongUser);
    }

    return next();
  } catch (error) {
    console.log(error)
    res.status(401).send(messageWrongUser);
    throw new UserError(messageWrongUser, 401, error);
  }
};

export default isAdmin;
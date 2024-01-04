import { Request, Response, NextFunction } from "express";
import UserRepository from "repositories/UserRepository";
import UserError from "errors/UserError";
import { User } from "types/User.type";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const uuid: string = req.params.uuid 
  const messageWrongUser: string = "Ops! Something is wrong with your data. You are not able to acces this page";

  if (!uuid) {
    return res.status(403).send(messageWrongUser);
  }
  
  try {
    const user: User | null = await UserRepository.getByPattern('uuid', uuid);

    if(user && user?.type != 'admin') {
      return res.status(403).send(messageWrongUser);
    }

  } catch (error) {
    console.log(error)
    res.status(401).send(messageWrongUser);
    throw new UserError(messageWrongUser, error, 401);
  }
  return next();
};

export default isAdmin;
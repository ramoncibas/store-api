import { Request, Response, NextFunction } from "express";
import findUserBy from "../models/User/findUserBy";
import { User } from "../types/User.type";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const uuid = req.params.uuid 
  const messageWrongUser = "Ops! Something is wrong with your data. You are not able to acces this page";

  if (!uuid) {
    return res.status(403).send(messageWrongUser);
  }
  
  try {
    const findUser = new findUserBy();
    const [user]: any = await findUser.uuid(uuid);
    console.log('user:', user)
    if(user.type != 'admin') {
      return res.status(403).send(messageWrongUser);
    }

  } catch (error) {
    console.log(error)
    return res.status(401).send("Invalid User Data");
  }
  return next();
};

export default isAdmin;
import { Router, static as static_ } from 'express';
import { authMiddleware, isAdmin, fileUpload } from 'middlewares';
import UserController from 'controllers/User/UserController';
import UserSchema from 'validators/schema/UserSchema';

const router = Router();

router.use(authMiddleware);

router.use("/profile/user_picture",
  static_(process.env.BUCKET_USER_PICTURE!)
);

router.get("/profile/:uuid",
  UserSchema.get,
  UserController.getUser
);

router.get("/users/all",
  isAdmin,
  UserSchema.getAll,
  UserController.getAllUsers
);

router.patch("/profile/:uuid",
  fileUpload,
  UserSchema.update,
  UserController.updateUser
);

export default router;
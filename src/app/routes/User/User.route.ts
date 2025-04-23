import { Router, static as static_ } from 'express';
import { AuthGuard, AuthAdmin, FileUploadMiddleware } from 'middlewares';
import UserController from 'controllers/User/UserController';
import UserSchema from 'validators/schema/UserSchema';

const router = Router();

router.use(AuthGuard);

const bucketPath = process.env.BUCKET_USER_PICTURE ?? '.temp';

router.use("/profile/user_picture",
  static_(bucketPath)
);

router.get("/all",
  AuthAdmin,
  UserSchema.getAll,
  UserController.getAll
);

router.get("/profile/:uuid",
  UserSchema.get,
  UserController.get
);

router.patch("/profile/:uuid",
  FileUploadMiddleware,
  UserSchema.update,
  UserController.update
);

router.delete("/:uuid",
  UserSchema.delete,
  UserController.delete
);

export default router;
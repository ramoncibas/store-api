import { Router } from 'express';
import AuthController from 'controllers/Auth/AuthController';
import AuthSchema from 'validators/schema/AuthSchema';

const router = Router();

AuthController.initialize();

router.post("/login",
  AuthSchema.login,
  AuthController.loginUser
);

router.post("/logout",
  AuthSchema.logout,
  AuthController.logoutUser
);

router.post("/register",
  AuthSchema.register,
  AuthController.registerUser
);

export default router;

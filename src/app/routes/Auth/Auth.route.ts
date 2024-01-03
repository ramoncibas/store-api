import { Router } from 'express';

import AuthController from 'controllers/Auth/AuthController';
import UserController from 'controllers/User/UserController';

const router = Router();

router.post('/login', AuthController.loginUser);
router.post('/logout', AuthController.logoutUser);
router.post('/register', UserController.createUser);

export default router;

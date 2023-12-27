import express from 'express';
import UserController from 'controllers/User/UserController';
import { authMiddleware, fileUpload } from 'middlewares';

const router = express.Router();
const { BUCKET_USER_PICTURE = '' } = process.env;

router.use('/profile/user_picture', express.static(BUCKET_USER_PICTURE));
router.get("/profile/:uuid", authMiddleware, UserController.getUser);
router.patch("/profile/:uuid", authMiddleware, fileUpload, UserController.updateUser);

export default router;
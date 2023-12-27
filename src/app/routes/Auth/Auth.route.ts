// Auth.route.ts
import express from 'express';
import * as AuthController from 'controllers/Auth/AuthController';

const router = express.Router();

// Adicione rotas de autenticação conforme necessário
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

export default router;

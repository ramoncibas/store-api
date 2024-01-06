import { Router } from 'express';

import ShoppingCartController from 'controllers/ShoppingCart/ShoppingCartController';
import { authMiddleware } from 'middlewares';

const router = Router();

router.get('/', authMiddleware, ShoppingCartController.getShoppingCartProducts); // Lembrar de armazenar os produtos local, caso o customer não esteja logado, para economizar nessa request
router.post('/:id', ShoppingCartController.createShoppingCartProduct);
router.patch('/:id', ShoppingCartController.updateShoppingCartProduct);
router.delete('/:id', ShoppingCartController.deleteShoppingCartItem);

export default router;

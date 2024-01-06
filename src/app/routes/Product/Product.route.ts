import { Router } from 'express';

import ProductController from 'controllers/Product/ProductController';
import ShoppingCartController from 'controllers/Product/ShoppingCartController';
import { authMiddleware, isAdmin } from 'middlewares';

const router = Router();

router.get('/cart', authMiddleware, ShoppingCartController.getShoppingCartProducts); // Lembrar de armazenar os produtos local, caso o customer não esteja logado, para economizar nessa request
router.post('/cart/:id', ShoppingCartController.createShoppingCartProduct);
router.patch('/cart/:id', ShoppingCartController.updateShoppingCartProduct);
router.delete('/cart/:id', ShoppingCartController.deleteShoppingCartItem);

router.get("/", ProductController.getProducts);
router.get("/aspects", ProductController.getAllAspects);
router.get("/:id", ProductController.getProductById);
router.post("/create", authMiddleware, isAdmin, ProductController.createProduct);
router.patch("/edit", authMiddleware, isAdmin, ProductController.updateProduct);
router.delete("/delete", authMiddleware, isAdmin, ProductController.deleteProduct);

export default router;

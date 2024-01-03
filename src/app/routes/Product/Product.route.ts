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
router.get("/product/aspects", ProductController.getAllAspects);
router.get("/product/:id", authMiddleware, ProductController.getProductById);
router.post("/product", authMiddleware, isAdmin, ProductController.createProduct);
router.patch("/product", authMiddleware, isAdmin, ProductController.updateProduct);
router.delete("/product", authMiddleware, isAdmin, ProductController.deleteProduct);

export default router;

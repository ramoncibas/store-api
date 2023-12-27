// Product.route.ts
import express from 'express';
import * as ProductController from 'controllers/ProductController';
import { authMiddleware, isAdmin } from 'middlewares';

const router = express.Router();

router.get('/cart', ProductController.getShoppingCartProduct);
router.delete('/cart', ProductController.deleteShoppingCartProduct);

router.get("/", ProductController.getProducts);
router.get("/product/aspects", ProductController.getAllAspects);
router.get("/product/:id", authMiddleware, ProductController.getProductById);
router.post("/product", authMiddleware, isAdmin, ProductController.saveProduct);
router.patch("/product", authMiddleware, isAdmin, ProductController.updateProduct);
router.delete("/product", authMiddleware, isAdmin, ProductController.deleteProduct);

export default router;

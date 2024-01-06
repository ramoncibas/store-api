import { Router } from 'express';

import ProductController from 'controllers/Product/ProductController';
import { authMiddleware, isAdmin } from 'middlewares';

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/aspects", ProductController.getAllAspects);
router.get("/:id", ProductController.getProductById);
router.post("/create", authMiddleware, isAdmin, ProductController.createProduct);
router.patch("/edit", authMiddleware, isAdmin, ProductController.updateProduct);
router.delete("/delete", authMiddleware, isAdmin, ProductController.deleteProduct);

export default router;

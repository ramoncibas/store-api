import { Router } from 'express';
import ProductController from 'controllers/Product/ProductController';
import { authMiddleware, isAdmin } from 'middlewares';
import ProductSchema from 'validators/ProductSchema';

const router = Router();
const authRoutesMiddleware  = [authMiddleware, isAdmin];

router.get("/", ProductController.getProducts);
router.get("/aspects", ProductController.getAllAspects);
router.get("/:id", ProductController.getProductById);
router.post("/create", ...authRoutesMiddleware, ProductSchema.create, ProductController.createProduct);
router.patch("/edit", ...authRoutesMiddleware, ProductController.updateProduct);
router.delete("/delete", ...authRoutesMiddleware, ProductController.deleteProduct);

export default router;

import { Router } from 'express';
import ProductController from 'controllers/Product/ProductController';
import { authMiddleware, isAdmin } from 'middlewares';
import ProductSchema from 'validators/schema/ProductSchema';

const router = Router();
const authRoutesMiddleware = [authMiddleware, isAdmin];

router.get("/",
  ProductSchema.get,
  ProductController.getProducts
);

router.get("/aspects",
  ProductSchema.get,
  ProductController.getAllAspects
);

router.get("/:id",
  ProductSchema.getId,
  ProductController.getProductById
);

router.post("/create",
  ...authRoutesMiddleware,
  ProductSchema.create,
  ProductController.createProduct
);

router.patch("/update",
  ...authRoutesMiddleware,
  ProductSchema.update,
  ProductController.updateProduct
);

router.delete("/delete",
  ...authRoutesMiddleware,
  ProductSchema.remove,
  ProductController.deleteProduct
);

export default router;
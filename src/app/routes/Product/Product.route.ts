import { Router } from 'express';
import { AuthGuard, AuthAdmin } from 'middlewares';
import ProductController from 'controllers/Product/ProductController';
import ProductSchema from 'validators/schema/ProductSchema';

const router = Router();
const authRoutesMiddleware = [AuthGuard, AuthAdmin];

router.get("/all",
  ProductSchema.get,
  ProductController.getAll
);

router.get("/attributes",
  ProductSchema.get,
  ProductController.attributes
);

router.post("/filter",
  ProductSchema.filter,
  ProductController.filter
);

router.get("/:id",
  ProductSchema.getId,
  ProductController.getById
);

router.post("/create",
  ...authRoutesMiddleware,
  ProductSchema.create,
  ProductController.create
);

router.patch("/:id",
  ...authRoutesMiddleware,
  ProductSchema.update,
  ProductController.update
);

router.delete("/:id",
  ...authRoutesMiddleware,
  ProductSchema.delete,
  ProductController.delete
);

export default router;
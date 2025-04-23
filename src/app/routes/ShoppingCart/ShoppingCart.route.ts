import { Router } from 'express';
import { AuthGuard } from 'middlewares';
import ShoppingCartSchema from 'validators/schema/ShoppingCartSchema';
import ShoppingCartController from 'controllers/ShoppingCart/ShoppingCartController';

const router = Router();

router.get("/",
  AuthGuard,
  ShoppingCartSchema.get,
  ShoppingCartController.get
);

router.post("/",
  AuthGuard,
  ShoppingCartSchema.add,
  ShoppingCartController.add
);

router.patch("/:id",
  AuthGuard,
  ShoppingCartSchema.update,
  ShoppingCartController.updateQuantity
);

router.delete("/:id",
  AuthGuard,
  ShoppingCartSchema.remove,
  ShoppingCartController.remove
);

router.delete("/clear",
  AuthGuard,
  ShoppingCartSchema.clear,
  ShoppingCartController.clear
);

export default router;
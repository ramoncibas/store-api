import { Router } from 'express';

import ShoppingCartController from 'controllers/ShoppingCart/ShoppingCartController';
import { authMiddleware } from 'middlewares';
import ShoppingCartSchema from 'validators/schema/ShoppingCartSchema';

const router = Router();

router.get("/",
  authMiddleware,
  ShoppingCartSchema.get,
  ShoppingCartController.getCartItems
); // Lembrar de armazenar os produtos local, caso o customer não esteja logado, para economizar nessa request

router.post("/create/:id",
  ShoppingCartSchema.create,
  ShoppingCartController.addToCart
);

router.patch("/update/:id",
  ShoppingCartSchema.update,
  ShoppingCartController.updateCartItemQuantity
);

router.delete("/remove/:id",
  ShoppingCartSchema.remove,
  ShoppingCartController.removeCartItem
);

router.delete("/clean/:customer_id",
  ShoppingCartSchema.clean,
  ShoppingCartController.cleanCart
);

export default router;
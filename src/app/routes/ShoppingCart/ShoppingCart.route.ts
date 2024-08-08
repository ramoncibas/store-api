import { Router } from 'express';

import ShoppingCartController from 'controllers/ShoppingCart/ShoppingCartController';
import { authMiddleware } from 'middlewares';
import ShoppingCartSchema from 'validators/schema/ShoppingCartSchema';

const router = Router();

router.get("/:customer_id",
  authMiddleware,
  ShoppingCartSchema.get,
  ShoppingCartController.getCartItems
); // Lembrar de armazenar os produtos local, caso o customer não esteja logado, para economizar nessa request

router.post("/add/:customer_id",
  ShoppingCartSchema.create,
  ShoppingCartController.addToCart
);

router.patch("/update/:cart_id",
  ShoppingCartSchema.update,
  ShoppingCartController.updateCartItemQuantity
);

router.delete("/:customer_id/remove/item/:id",
  ShoppingCartSchema.remove,
  ShoppingCartController.removeCartItem
);

router.delete("/clean/:customer_id",
  ShoppingCartSchema.clean,
  ShoppingCartController.cleanCart
);

export default router;
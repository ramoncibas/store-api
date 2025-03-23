import { Router } from 'express';

import { authMiddleware } from 'middlewares';
import ShoppingCartController from 'controllers/ShoppingCart/ShoppingCartController';
import ShoppingCartSchema from 'validators/schema/ShoppingCartSchema';

const router = Router();

// TODO: 
// Apenas o customer pode acessar o carrinho dele, se não estiver logado usar o localstorage para armazenar os produtos

router.get("/:customer_id",
  // authMiddleware,
  ShoppingCartSchema.get,
  ShoppingCartController.getCartItems
);

router.post("/add/:customer_id",
  // authMiddleware,
  ShoppingCartSchema.create,
  ShoppingCartController.addToCart
);

router.patch("/update/:cart_id",
  // authMiddleware,
  ShoppingCartSchema.update,
  ShoppingCartController.updateCartItemQuantity
);

router.delete("/:customer_id/remove/item/:id",
  // authMiddleware,
  ShoppingCartSchema.remove,
  ShoppingCartController.removeCartItem
);

router.delete("/clean/:customer_id",
  // authMiddleware,
  ShoppingCartSchema.clean,
  ShoppingCartController.cleanCart
);

export default router;
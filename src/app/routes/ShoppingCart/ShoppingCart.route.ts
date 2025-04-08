import { Router } from 'express';

import { authMiddleware } from 'middlewares';
import ShoppingCartController from 'controllers/ShoppingCart/ShoppingCartController';
import ShoppingCartSchema from 'validators/schema/ShoppingCartSchema';

const router = Router();

// TODO: 
// Apenas o customer pode acessar o carrinho dele, se não estiver logado usar o localstorage para armazenar os produtos

router.get("/",
  authMiddleware,
  ShoppingCartSchema.get,
  ShoppingCartController.getCart
);

router.post("/add",
  authMiddleware,
  ShoppingCartSchema.create,
  ShoppingCartController.addProduct
);

router.patch("/update/:cart_id",
  authMiddleware,
  ShoppingCartSchema.update,
  ShoppingCartController.updateQuantity
);

router.delete("/remove/:cart_id",
  authMiddleware,
  ShoppingCartSchema.remove,
  ShoppingCartController.remove
);

router.delete("/clear",
  authMiddleware,
  ShoppingCartSchema.clear,
  ShoppingCartController.clear
);

export default router;
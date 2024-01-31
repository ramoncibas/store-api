import { Router } from 'express';

import { authMiddleware, isAdmin } from 'middlewares';
import CustomerController from 'controllers/Customer/CustomerController';
import CustomerSchema from 'validators/schema/CustomerSchema';

const router = Router();

router.get("/:uuid",
  authMiddleware,
  CustomerSchema.get,
  CustomerController.getCustomer
);

router.post("/create",
  authMiddleware,
  CustomerSchema.create,
  CustomerController.createCustomer
);

router.patch("/update/:uuid",
  authMiddleware,
  CustomerSchema.update,
  CustomerController.updateCustomer
);

router.delete("/delete/:uuid",
  ...[authMiddleware, isAdmin],
  CustomerSchema.remove,
  CustomerController.deleteCustomer
);

export default router;

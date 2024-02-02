import { Router } from 'express';

import { authMiddleware, isAdmin } from 'middlewares';
import CustomerController from 'controllers/Customer/CustomerController';
import CustomerSchema from 'validators/schema/CustomerSchema';

const router = Router();

router.use(authMiddleware);

router.get("/:uuid",
  CustomerSchema.get,
  CustomerController.getCustomer
);

router.post("/create",
  CustomerSchema.create,
  CustomerController.createCustomer
);

router.patch("/update/:uuid",
  CustomerSchema.update,
  CustomerController.updateCustomer
);

router.delete("/delete/:uuid",
  isAdmin,
  CustomerSchema.remove,
  CustomerController.deleteCustomer
);

export default router;
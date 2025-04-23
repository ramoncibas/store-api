import { Router } from 'express';

import { AuthGuard } from 'middlewares';
import ReviewController from 'controllers/Review/ReviewController';
import ReviewSchema from 'validators/schema/ReviewSchema';

const router = Router();

router.get("/customer",
  AuthGuard,
  ReviewSchema.getByCustomerId,
  ReviewController.getByCustomer
);

router.get("/product/:id",
  ReviewSchema.getById,
  ReviewController.getByProduct
);

router.post("/create",
  AuthGuard,
  ReviewSchema.create,
  ReviewController.create
);

router.patch("/:uuid",
  AuthGuard,
  ReviewSchema.update,
  ReviewController.update
);

router.delete("/:uuid",
  AuthGuard,
  ReviewSchema.remove,
  ReviewController.delete
);


export default router;
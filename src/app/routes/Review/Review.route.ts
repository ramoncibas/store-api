import { Router } from 'express';

import { authMiddleware } from 'middlewares';
import ReviewController from 'controllers/Review/ReviewController';
import ReviewSchema from 'validators/schema/ReviewSchema';

const router = Router();

router.get("/customer/:id",
  authMiddleware,
  ReviewSchema.getByCustomerId,
  ReviewController.getByCustomer
);

router.get("/product/:id",
  ReviewSchema.getById,
  ReviewController.getByProduct
);

router.post("/customer/:uuid/create",
  authMiddleware,
  ReviewSchema.create,
  ReviewController.create
);

router.patch("/:uuid",
  authMiddleware,
  ReviewSchema.update,
  ReviewController.update
);

router.delete("/:uuid/delete",
  authMiddleware,
  ReviewSchema.remove,
  ReviewController.delete
);


export default router;
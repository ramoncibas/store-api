import { Router } from 'express';

import { authMiddleware } from 'middlewares';
import CustomerController from 'controllers/Customer/CustomerController';

const router = Router();

router.get('/:uuid', authMiddleware, CustomerController.getCustomer);
router.post('/create', authMiddleware, CustomerController.createCustomer);
router.post('/:uuid/reviews', authMiddleware, CustomerController.createReview);
router.patch("/:uuid", authMiddleware, CustomerController.updateCustomer);

export default router;

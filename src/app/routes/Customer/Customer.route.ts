import { Router } from 'express';

import { authMiddleware } from 'middlewares';
import CustomerController from 'controllers/Customer/CustomerController';

const router = Router();

router.get('/customer/:uuid', authMiddleware, CustomerController.getCustomer);
router.post('/customer/create', authMiddleware, CustomerController.createCustomer);
router.post('/customer/:uuid/reviews', authMiddleware, CustomerController.createReview);
router.patch("/customer/:uuid", authMiddleware, CustomerController.updateCustomer);

export default router;

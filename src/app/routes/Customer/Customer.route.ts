// Customer.route.ts
import express from 'express';
import { authMiddleware } from 'middlewares';
import CustomerController from 'controllers/Customer/CustomerController';

const router = express.Router();

router.post('/customer/create', CustomerController.saveCustomer);
router.get('/customer/:uuid', authMiddleware, CustomerController.getCustomer);

export default router;

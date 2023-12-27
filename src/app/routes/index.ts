import express from 'express';

import customerRoutes from './Customer/Customer.route';
import userRoutes from './User/User.route';
import productRoutes from './Product/Product.route';
import authRoutes from './Auth/Auth.route';

const router = express.Router();

router.use('/customer', customerRoutes);
router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/auth', authRoutes);

export default router;

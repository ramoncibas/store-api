import { Router } from 'express';

import customerRoutes from './Customer/Customer.route';
import ReviewRoutes from './Review/Review.route';
import userRoutes from './User/User.route';
import cartRoutes from './ShoppingCart/ShoppingCart.route';
import productRoutes from './Product/Product.route';
import authRoutes from './Auth/Auth.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/cart', cartRoutes);
router.use('/review', ReviewRoutes);
router.use('/product', productRoutes);
router.use('/customer', customerRoutes);

export default router;

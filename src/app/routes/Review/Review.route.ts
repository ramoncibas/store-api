import { Router } from 'express';

import { authMiddleware } from 'middlewares';
import ReviewController from 'controllers/Review/ReviewController';

const router = Router();

router.get('/product/:id', authMiddleware, ReviewController.getReviewByProduct);
router.get('/customer/:uuid', authMiddleware, ReviewController.getReview);
router.post('/:uuid/create', authMiddleware, ReviewController.createReview);
router.patch("/:uuid", authMiddleware, ReviewController.updateReview);
router.delete('/:uuid/delete', authMiddleware, ReviewController.deleteReview);

export default router;

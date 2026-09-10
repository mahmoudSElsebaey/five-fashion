import { Router } from 'express';
import { getProductReviews, getReviewById } from '../controllers/reviewController.js';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.get('/:id', getReviewById);

export default router;

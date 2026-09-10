import { Router } from 'express';
import {
  getProductReviews,
  getReviewById,
  createReview,
  updateMyReview,
  deleteMyReview,
  adminModerateReview,
  adminDeleteReview,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.get('/:id', getReviewById);

router.post('/', protect, createReview);
router.patch('/:id', protect, updateMyReview);
router.delete('/:id', protect, deleteMyReview);

router.patch('/admin/:id/moderate', protect, restrictTo('admin'), adminModerateReview);
router.delete('/admin/:id', protect, restrictTo('admin'), adminDeleteReview);

export default router;

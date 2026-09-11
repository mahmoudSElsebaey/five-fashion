import { Router } from 'express';
import {
  getProductReviews,
  getReviewById,
  createReview,
  updateMyReview,
  deleteMyReview,
  adminModerateReview,
  adminDeleteReview,
  adminListReviews,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/product/:productId', getProductReviews);

// Admin routes before /:id to avoid param capture
router.get('/admin/all', protect, restrictTo('admin'), adminListReviews);
router.patch('/admin/:id/moderate', protect, restrictTo('admin'), adminModerateReview);
router.delete('/admin/:id', protect, restrictTo('admin'), adminDeleteReview);

router.get('/:id', getReviewById);
router.post('/', protect, createReview);
router.patch('/:id', protect, updateMyReview);
router.delete('/:id', protect, deleteMyReview);

export default router;

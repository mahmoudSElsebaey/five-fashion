import { Router } from 'express';
import {
  getCouponByCode,
  adminListCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/admin/all', protect, restrictTo('admin'), adminListCoupons);
router.post('/', protect, restrictTo('admin'), createCoupon);
router.patch('/:id', protect, restrictTo('admin'), updateCoupon);
router.delete('/:id', protect, restrictTo('admin'), deleteCoupon);

router.get('/:code', getCouponByCode);

export default router;

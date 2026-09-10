import { Router } from 'express';
import { getCouponByCode } from '../controllers/couponController.js';

const router = Router();

router.get('/:code', getCouponByCode);

export default router;

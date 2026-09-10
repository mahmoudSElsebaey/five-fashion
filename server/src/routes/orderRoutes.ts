import { Router } from 'express';
import {
  getMyOrders,
  getMyOrderById,
  getMyOrderByNumber,
  createOrder,
  cancelMyOrder,
  adminListOrders,
  adminGetOrder,
  adminUpdateOrder,
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/admin/all', restrictTo('admin'), adminListOrders);
router.get('/admin/:id', restrictTo('admin'), adminGetOrder);
router.patch('/admin/:id', restrictTo('admin'), adminUpdateOrder);

router.get('/', getMyOrders);
router.post('/', createOrder);
router.get('/number/:orderNumber', getMyOrderByNumber);
router.get('/:id', getMyOrderById);
router.post('/:id/cancel', cancelMyOrder);

export default router;

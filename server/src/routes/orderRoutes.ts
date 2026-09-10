import { Router } from 'express';
import {
  getMyOrders,
  getMyOrderById,
  getMyOrderByNumber,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/', getMyOrders);
router.get('/number/:orderNumber', getMyOrderByNumber);
router.get('/:id', getMyOrderById);

export default router;

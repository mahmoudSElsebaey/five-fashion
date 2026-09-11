import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/admin/all', protect, restrictTo('admin'), getProducts);
router.get('/:id', getProductById);

router.post('/', protect, restrictTo('admin'), createProduct);
router.patch('/:id', protect, restrictTo('admin'), updateProduct);
router.patch('/:id/stock', protect, restrictTo('admin'), updateStock);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

export default router;

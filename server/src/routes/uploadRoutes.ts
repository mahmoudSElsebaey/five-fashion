import { Router } from 'express';
import { uploadProductImages, deleteProductImage } from '../controllers/uploadController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { uploadImages } from '../middleware/upload.js';

const router = Router();

router.post(
  '/images',
  protect,
  restrictTo('admin'),
  uploadImages.array('images', 10),
  uploadProductImages
);

router.delete(
  '/images',
  protect,
  restrictTo('admin'),
  deleteProductImage
);

export default router;

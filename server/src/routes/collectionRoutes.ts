import { Router } from 'express';
import {
  getCollections,
  getCollectionById,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
} from '../controllers/collectionController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/', getCollections);
router.get('/slug/:slug', getCollectionBySlug);
router.get('/:id', getCollectionById);

router.post('/', protect, restrictTo('admin'), createCollection);
router.patch('/:id', protect, restrictTo('admin'), updateCollection);
router.delete('/:id', protect, restrictTo('admin'), deleteCollection);

export default router;

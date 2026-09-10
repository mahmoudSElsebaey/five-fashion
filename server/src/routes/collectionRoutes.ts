import { Router } from 'express';
import {
  getCollections,
  getCollectionById,
  getCollectionBySlug,
} from '../controllers/collectionController.js';

const router = Router();

router.get('/', getCollections);
router.get('/slug/:slug', getCollectionBySlug);
router.get('/:id', getCollectionById);

export default router;

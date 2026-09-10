import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
} from '../controllers/categoryController.js';

const router = Router();

router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategoryById);

export default router;

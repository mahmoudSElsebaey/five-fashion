import { Router } from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/', getWishlist);
router.post('/items', addToWishlist);
router.delete('/items/:productId', removeFromWishlist);
router.delete('/', clearWishlist);

export default router;

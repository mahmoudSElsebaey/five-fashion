import { Router } from 'express';
import { adminListUsers, adminGetUser, adminUpdateUser } from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.use(protect, restrictTo('admin'));
router.get('/', adminListUsers);
router.get('/:id', adminGetUser);
router.patch('/:id', adminUpdateUser);

export default router;

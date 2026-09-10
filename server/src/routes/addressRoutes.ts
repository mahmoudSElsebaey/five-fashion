import { Router } from 'express';
import { getMyAddresses, getAddressById } from '../controllers/addressController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/', getMyAddresses);
router.get('/:id', getAddressById);

export default router;

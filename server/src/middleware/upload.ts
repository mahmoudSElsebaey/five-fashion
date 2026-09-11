import multer from 'multer';
import { AppError } from '../utils/AppError.js';

const storage = multer.memoryStorage();

const imageFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new AppError('Only image files are allowed', 400));
    return;
  }
  cb(null, true);
};

export const uploadImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    files: 10,
    fileSize: 8 * 1024 * 1024,
  },
});

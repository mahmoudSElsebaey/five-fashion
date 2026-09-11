import { Response } from 'express';
import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../config/cloudinary.js';
import { config } from '../config/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { AuthRequest } from '../middleware/auth.js';

function uploadBuffer(buffer: Buffer, mimetype: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: config.cloudinary.folder,
        resource_type: 'image',
        format: undefined,
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else if (!result) reject(new Error('Cloudinary returned no upload result'));
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export const uploadProductImages = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);

  const files = (req.files as Express.Multer.File[] | undefined) || [];
  if (!files.length) throw new AppError('No images uploaded', 400);

  const uploaded = await Promise.all(
    files.map(async (file) => {
      const result = await uploadBuffer(file.buffer, file.mimetype);
      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      };
    })
  );

  res.status(201).json({
    success: true,
    data: uploaded,
  });
});

export const deleteProductImage = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);

  const publicId = String(req.body.publicId || '').trim();
  if (!publicId) throw new AppError('publicId is required', 400);

  const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  if (result.result !== 'ok' && result.result !== 'not found') {
    throw new AppError('Failed to delete image from Cloudinary', 502);
  }

  res.status(200).json({ success: true, data: { publicId, result: result.result } });
});

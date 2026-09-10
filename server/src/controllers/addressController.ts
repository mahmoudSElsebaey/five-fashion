import { Response } from 'express';
import { Address } from '../models/Address.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { AuthRequest } from '../middleware/auth.js';
import { objectIdSchema } from '../validators/common.js';

export const getMyAddresses = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const addresses = await Address.find({ user: req.user._id })
    .sort({ isDefault: -1, createdAt: -1 })
    .lean();
  res.status(200).json({ success: true, data: addresses });
});

export const getAddressById = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const id = objectIdSchema.parse(req.params.id);
  const address = await Address.findOne({ _id: id, user: req.user._id }).lean();
  if (!address) throw new AppError('Address not found', 404);
  res.status(200).json({ success: true, data: address });
});

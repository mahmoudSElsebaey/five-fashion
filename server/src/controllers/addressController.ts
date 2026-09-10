import { Response } from 'express';
import { Address } from '../models/Address.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { AuthRequest } from '../middleware/auth.js';
import { objectIdSchema } from '../validators/common.js';
import { createAddressSchema, updateAddressSchema } from '../validators/commerceValidators.js';

export const getMyAddresses = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 }).lean();
  res.status(200).json({ success: true, data: addresses });
});

export const getAddressById = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const id = objectIdSchema.parse(req.params.id);
  const address = await Address.findOne({ _id: id, user: req.user._id }).lean();
  if (!address) throw new AppError('Address not found', 404);
  res.status(200).json({ success: true, data: address });
});

export const createAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const data = createAddressSchema.parse(req.body);
  if (data.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }
  const address = await Address.create({ ...data, user: req.user._id });
  res.status(201).json({ success: true, data: address });
});

export const updateAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const id = objectIdSchema.parse(req.params.id);
  const data = updateAddressSchema.parse(req.body);
  const address = await Address.findOne({ _id: id, user: req.user._id });
  if (!address) throw new AppError('Address not found', 404);
  if (data.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }
  Object.assign(address, data);
  await address.save();
  res.status(200).json({ success: true, data: address });
});

export const deleteAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const id = objectIdSchema.parse(req.params.id);
  const address = await Address.findOneAndDelete({ _id: id, user: req.user._id });
  if (!address) throw new AppError('Address not found', 404);
  res.status(200).json({ success: true, message: 'Address deleted' });
});

export const setDefaultAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  const id = objectIdSchema.parse(req.params.id);
  const address = await Address.findOne({ _id: id, user: req.user._id });
  if (!address) throw new AppError('Address not found', 404);
  await Address.updateMany({ user: req.user._id }, { isDefault: false });
  address.isDefault = true;
  await address.save();
  res.status(200).json({ success: true, data: address });
});

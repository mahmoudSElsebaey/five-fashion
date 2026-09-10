import { z } from 'zod';
import mongoose from 'mongoose';

export const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ID',
  });

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1),
});

export const idParamSchema = z.object({
  id: objectIdSchema,
});

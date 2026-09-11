import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const MIN_SECRET_LENGTH = 32;

function requireSecret(name: string, value: string | undefined, fallbackDev: string): string {
  const raw = (value || '').trim();
  if (isProduction) {
    if (!raw || raw.length < MIN_SECRET_LENGTH) {
      console.error(
        `[config] FATAL: ${name} must be set in production and be at least ${MIN_SECRET_LENGTH} characters`
      );
      process.exit(1);
    }
    const weak = ['change_me', 'dev_access', 'dev_refresh', 'your_super_secure', 'secret', 'password'];
    if (weak.some((w) => raw.toLowerCase().includes(w))) {
      console.error(`[config] FATAL: ${name} appears to be a placeholder — refuse to start in production`);
      process.exit(1);
    }
    return raw;
  }
  return raw || fallbackDev;
}

function parseClientOrigins(raw: string | undefined): string | string[] {
  const value = (raw || 'http://localhost:5173').trim();
  if (value.includes(',')) return value.split(',').map((s) => s.trim()).filter(Boolean);
  return value;
}

if (isProduction && !process.env.MONGODB_URI) {
  console.error('[config] FATAL: MONGODB_URI is required in production');
  process.exit(1);
}

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() || '';
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY?.trim() || '';
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET?.trim() || '';

if (isProduction && (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret)) {
  console.error(
    '[config] FATAL: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are required in production'
  );
  process.exit(1);
}

export const config = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT) || 5000,
  clientUrl: parseClientOrigins(process.env.CLIENT_URL),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/five-fashion',
  cloudinary: {
    cloudName: cloudinaryCloudName,
    apiKey: cloudinaryApiKey,
    apiSecret: cloudinaryApiSecret,
    folder: process.env.CLOUDINARY_FOLDER?.trim() || 'five-fashion/products',
  },
  jwt: {
    accessSecret: requireSecret(
      'JWT_ACCESS_SECRET',
      process.env.JWT_ACCESS_SECRET,
      'dev_access_secret_change_me_min_32_chars_ok'
    ),
    refreshSecret: requireSecret(
      'JWT_REFRESH_SECRET',
      process.env.JWT_REFRESH_SECRET,
      'dev_refresh_secret_change_me_min_32_chars_ok'
    ),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  apiVersion: process.env.API_VERSION || '0.4.0',
};

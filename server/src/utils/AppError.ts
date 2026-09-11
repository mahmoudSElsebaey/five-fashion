export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors?: unknown;
  code?: string;

  constructor(message: string, statusCode = 500, errors?: unknown, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

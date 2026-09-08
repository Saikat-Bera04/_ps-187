export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code || 'ERROR';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message = 'Bad Request', code = 'BAD_REQUEST') {
    return new AppError(message, 400, code);
  }

  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    return new AppError(message, 401, code);
  }

  static forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
    return new AppError(message, 403, code);
  }

  static notFound(message = 'Not Found', code = 'NOT_FOUND') {
    return new AppError(message, 404, code);
  }

  static conflict(message = 'Conflict', code = 'CONFLICT') {
    return new AppError(message, 409, code);
  }

  static validationError(message = 'Validation Error', code = 'VALIDATION_ERROR') {
    return new AppError(message, 422, code);
  }

  static tooManyRequests(message = 'Too Many Requests', code = 'RATE_LIMITED') {
    return new AppError(message, 429, code);
  }

  static internal(message = 'Internal Server Error', code = 'INTERNAL_ERROR') {
    return new AppError(message, 500, code);
  }

  static serviceUnavailable(message = 'Service Unavailable', code = 'SERVICE_UNAVAILABLE') {
    return new AppError(message, 503, code);
  }
}

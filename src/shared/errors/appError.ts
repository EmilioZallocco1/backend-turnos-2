export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "No autenticado", details?: unknown) {
    super(401, message, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "No autorizado", details?: unknown) {
    super(403, message, details);
  }
}

export class NotFoundAppError extends AppError {
  constructor(message = "Resource not found", details?: unknown) {
    super(404, message, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(409, message, details);
  }
}

/**
 * Clase base para errores operacionales del sistema.
 */
export class AppError extends Error {
  public readonly isOperational: boolean;

  constructor(
    public message: string,
    public statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

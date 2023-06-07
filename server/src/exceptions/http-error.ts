import { ValidationError } from 'express-validator';

export default class HttpError extends Error {
  public status: number;
  public success: boolean;
  public errors: ValidationError[];

  constructor(message: string, status: number, errors: ValidationError[] | never[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.success = false;
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  static UnauthorizedError(): HttpError {
    return new HttpError("User isn't authorized! Please, authorize than try again.", 401);
  }

  static BadRequest(message: string, errors: ValidationError[] | never[] = []) {
    return new HttpError(message, 400, errors);
  }
}

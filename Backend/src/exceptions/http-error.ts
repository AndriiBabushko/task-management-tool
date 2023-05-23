export default class HttpError extends Error {
  public status: number;
  public success: boolean
  public errors: any[];

  constructor(message: string, status: number, errors: any[] = []) {
    super(message);
    this.status = status;
    this.success = false;
    errors = [];
    Object.setPrototypeOf(this, HttpError.prototype)
  }

  static UnauthorizedError() {
    return new HttpError("User isn't authorized! Please, authorize than try again.", 401);
  }

  static BadRequest(message: string, errors: any[] = []) {
    return new HttpError(message, 400, errors)
  }
}
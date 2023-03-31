class HttpError extends Error {
  public code: number;
  public success: boolean

  constructor(message: string, errorCode: number) {
    super(message);
    this.code = errorCode;
    this.success = false;
  }
}

export default HttpError;
import { NextFunction, Request, Response } from 'express';
import HttpError from '../exceptions/http-error.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ErrorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);

  if (err instanceof HttpError) {
    const httpError = err as HttpError;
    return res
      .status(httpError.status)
      .json({ message: httpError.message, errors: httpError.errors, success: httpError.success });
  }

  return res.status(500).json({ message: 'An unknown error occurred!' });
};

export { ErrorMiddleware };

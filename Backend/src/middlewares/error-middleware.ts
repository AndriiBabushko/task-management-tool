import { NextFunction, Request, Response } from "express";
import HttpError from "../exceptions/http-error.js";

const ErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);

  if (err instanceof HttpError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }

  return res.status(500).json({ message: "An unknown error occurred!" });
};

export { ErrorMiddleware };

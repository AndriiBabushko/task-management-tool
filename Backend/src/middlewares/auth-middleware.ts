import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";

import HttpError from "../exceptions/http-error.js";
import { IUserDataRequest } from "../ts/interfaces/IUserDataRequest.js";

export const checkJWT = (
  req: IUserDataRequest,
  res: Response,
  next: NextFunction
): void => {
  let token: string;
  let userId;

  try {
    token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'

    if (!token) return next(new HttpError("Authentication failed!", 401));

    userId = jwt.verify(token, "task_management_tool_token");

    req.userData = userId;
    req.token = token;
  } catch (e) {
    console.log(e.message);
    return next(new HttpError("Authentication failed!", 401));
  }

  next();
};

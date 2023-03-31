import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";

import HttpError from "../models/http-error-model";
import { IUserDataRequest } from "../ts/interfaces/IUserDataRequest";
import { IUserJwtPayload } from "../ts/interfaces/IUserJwtPayload";

export const checkJWT = (
  req: IUserDataRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string;
  let userId;

  try {
    token = req.headers.authorization; // Authorization: 'TOKEN'

    if (!token)
      return next(new HttpError("Authentication failed!", 401));

    userId = jwt.verify(token, "task_management_tool_token") as IUserJwtPayload;

    req.userData = { userId };
  } catch (e) {
    return next(new HttpError("Authentication failed!", 401));
  }

  return next();
};

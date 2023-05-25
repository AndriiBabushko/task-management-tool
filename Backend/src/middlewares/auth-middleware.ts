import { NextFunction, Response } from 'express';

import HttpError from '../exceptions/http-error.js';
import { IUserDataRequest } from '../ts/interfaces/IUserDataRequest.js';
import TokenService from '../services/token-service.js';

export const AuthMiddleware = (req: IUserDataRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader: string = req.headers.authorization;
    if (!authHeader) return next(HttpError.UnauthorizedError());

    const accessToken: string = authHeader.split(' ')[1];
    if (!accessToken) return next(HttpError.UnauthorizedError());

    const userData = TokenService.validateAccessToken(accessToken);
    if (!userData) return next(HttpError.UnauthorizedError());

    req.user = userData;
    next();
  } catch (e) {
    return next(e);
  }
};

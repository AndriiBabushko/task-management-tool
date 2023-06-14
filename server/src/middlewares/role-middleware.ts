import { NextFunction, Response } from 'express';

import HttpError from '../exceptions/http-error.js';
import { IUserDataRequest } from '../ts/interfaces/IUserDataRequest.js';

export const RoleMiddleware = async (req: IUserDataRequest, res: Response, next: NextFunction) => {
  try {
    const userData = req.userData;

    if ([...userData.roles].some((role) => role.name === 'admin')) {
      next();
    } else {
      next(new HttpError('Access denied!', 403));
    }
  } catch (e) {
    next(e);
  }
};

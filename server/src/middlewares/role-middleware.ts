import { IUserDataRequest } from '../ts/interfaces/IUserDataRequest.js';
import { NextFunction, Response } from 'express';

import { mongooseModel as RoleModel } from '../models/role-model.js';
import HttpError from '../exceptions/http-error.js';

export const RoleMiddleware = async (req: IUserDataRequest, res: Response, next: NextFunction) => {
  try {
    const userData = req.userData;

    userData.roles.map(async (roleID: string) => {
      let role;

      try {
        role = await RoleModel.findById(roleID);
      } catch (e) {
        next(new HttpError('Something went wrong while searching for roles.', 500));
      }

      if (role.name == 'admin') next();
    });

    next(new HttpError('Access denied!', 403));
  } catch (e) {
    next(e);
  }
};

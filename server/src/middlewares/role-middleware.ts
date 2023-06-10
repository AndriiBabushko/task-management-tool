import { IUserDataRequest } from '../ts/interfaces/IUserDataRequest.js';
import { NextFunction, Response } from 'express';

import { mongooseModel as RoleModel } from '../models/role-model.js';
import { IRole } from '../ts/interfaces/IRole.js';
import HttpError from '../exceptions/http-error.js';

export const RoleMiddleware = async (req: IUserDataRequest, res: Response, next: NextFunction) => {
  try {
    const userData = req.userData;

    console.log(userData);
    const roles: IRole[] = [];

    req.userData.roles.map(async (roleID: string) => {
      try {
        const role = await RoleModel.findById(roleID);
        roles.push(role);
      } catch (e) {
        next(new HttpError('Something went wrong while searching for roles.', 500));
      }
    });

    if (roles.some((role) => role.name != 'admin')) {
      next(new HttpError('Access denied!', 403));
    }

    next();
  } catch (e) {
    next(e);
  }
};

import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import RoleService from '../services/role-service.js';
import HttpError from '../exceptions/http-error.js';

const getRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rolesData = await RoleService.getRoles();

    return res.status(200).json(rolesData);
  } catch (e) {
    next(e);
  }
};

const getRoleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleID: string = req.params.roleID;

    const roleData = await RoleService.getRoleByID(roleID);

    return res.status(200).json(roleData);
  } catch (e) {
    next(e);
  }
};

const createRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(HttpError.BadRequest('Create role validation error. Please, check your credentials.', errors.array()));
    }

    const roleData = await RoleService.createRole(req.body);

    return res.status(200).json({ ...roleData, message: 'Role is successfully created!' });
  } catch (e) {
    next(e);
  }
};

const updateRoleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(HttpError.BadRequest('Update role validation error. Please, check your credentials.', errors.array()));
    }

    const roleID: string = req.params.roleID;

    const roleData = await RoleService.updateRole(roleID, req.body);

    return res.status(200).json({ ...roleData, message: 'Role is successfully updated!' });
  } catch (e) {
    next(e);
  }
};

const deleteRoleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleID: string = req.params.roleID;

    const roleData = await RoleService.deleteRole(roleID);

    return res.status(201).json({
      ...roleData,
      message: `Successful deleted role with ${roleID} ID.`,
    });
  } catch (e) {
    next(e);
  }
};

export { getRoles, getRoleById, createRole, updateRoleById, deleteRoleById };

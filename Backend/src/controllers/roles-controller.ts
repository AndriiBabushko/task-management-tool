import { NextFunction, Request, Response } from "express";

const getRoles = (req: Request, res: Response, next: NextFunction) => {};

const getRoleById = (req: Request, res: Response, next: NextFunction) => {};

const createRole = (req: Request, res: Response, next: NextFunction) => {};

const updateRoleById = (req: Request, res: Response, next: NextFunction) => {};

const deleteRoleById = (req: Request, res: Response, next: NextFunction) => {};

export {
    getRoles,
    getRoleById,
    createRole,
    updateRoleById,
    deleteRoleById,
};

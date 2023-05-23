import { NextFunction, Request, Response } from "express";

const getTags = (req: Request, res: Response, next: NextFunction) => {};

const getTagById = (req: Request, res: Response, next: NextFunction) => {};

const createTag = (req: Request, res: Response, next: NextFunction) => {};

const updateTagById = (req: Request, res: Response, next: NextFunction) => {};

const deleteTagById = (req: Request, res: Response, next: NextFunction) => {};

export {
    getTags,
    getTagById,
    createTag,
    updateTagById,
    deleteTagById,
};

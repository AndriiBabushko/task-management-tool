import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import TagService from '../services/tag-service.js';
import HttpError from '../exceptions/http-error.js';

const getTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tagsData = await TagService.getTags();

    return res.status(200).json(tagsData);
  } catch (e) {
    next(e);
  }
};

const getTagById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tagID: string = req.params.tagID;

    const tagData = await TagService.getTagByID(tagID);

    return res.status(200).json(tagData);
  } catch (e) {
    next(e);
  }
};

const createTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(HttpError.BadRequest('Create tag validation error. Please, check your credentials.', errors.array()));
    }

    const tagData = await TagService.createTag(req.body);

    return res.status(200).json({ ...tagData, message: 'Tag is successfully created!' });
  } catch (e) {
    next(e);
  }
};

const updateTagById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(HttpError.BadRequest('Update tag validation error. Please, check your credentials.', errors.array()));
    }

    const tagID: string = req.params.tagID;

    const tagData = await TagService.updateTag(tagID, req.body);

    return res.status(200).json({ ...tagData, message: 'Tag is successfully updated!' });
  } catch (e) {
    next(e);
  }
};

const deleteTagById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tagID: string = req.params.tagID;

    const tagData = await TagService.deleteTag(tagID);

    return res.status(201).json({
      ...tagData,
      message: `Successful deleted tag with ${tagID} ID.`,
    });
  } catch (e) {
    next(e);
  }
};

export { getTags, getTagById, createTag, updateTagById, deleteTagById };

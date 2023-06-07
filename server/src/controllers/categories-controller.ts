import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import HttpError from '../exceptions/http-error.js';
import CategoryService from '../services/category-service.js';

const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoriesData = await CategoryService.getCategories();

    return res.status(200).json(categoriesData);
  } catch (e) {
    next(e);
  }
};

const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryID: string = req.params.categoryID;

    const categoryData = await CategoryService.getCategoryByID(categoryID);

    return res.status(200).json(categoryData);
  } catch (e) {
    next(e);
  }
};

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(HttpError.BadRequest('Create category validation error. Please, check your credentials.', errors.array()));
    }

    const categoryData = await CategoryService.createCategory(req.body);

    return res.status(200).json({ ...categoryData, message: 'Category is successfully created!' });
  } catch (e) {
    next(e);
  }
};

const updateCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(HttpError.BadRequest('Update category validation error. Please, check your credentials.', errors.array()));
    }

    const categoryID: string = req.params.categoryID;

    const tagData = await CategoryService.updateCategory(categoryID, req.body);

    return res.status(200).json({ ...tagData, message: 'Category is successfully updated!' });
  } catch (e) {
    next(e);
  }
};

const deleteCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryID: string = req.params.categoryID;

    const categoryData = await CategoryService.deleteCategory(categoryID);

    return res.status(201).json({
      ...categoryData,
      message: `Successful deleted category with ${categoryID} ID.`,
    });
  } catch (e) {
    next(e);
  }
};

export { getCategories, getCategoryById, createCategory, updateCategoryById, deleteCategoryById };

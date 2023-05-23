import { NextFunction, Request, Response } from 'express';
import { ClientSession, startSession } from 'mongoose';

import { ICategory } from '../ts/interfaces/ICategory.js';
import HttpError from '../exceptions/http-error.js';
import { mongooseModel as CategoryModel } from '../models/category-model.js';

const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  let categories;

  try {
    categories = await CategoryModel.find();
  } catch (e) {
    return next(new HttpError('Something went wrong while fetching categories data from DB.', 500));
  }

  return res.status(201).json({
    categories: categories.map((c) => c.toObject({ getters: true })),
    success: true,
  });
};

const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  const categoryID: string = req.params.categoryID;
  let category;

  try {
    category = await CategoryModel.findById(categoryID);
  } catch (e) {
    return next(new HttpError('Something went wrong while searching for some category by category ID.', 500));
  }

  if (!category) {
    return next(new HttpError("Couldn't find a category for the provided category ID!", 404));
  }

  return res.status(201).json({ category: category.toObject({ getters: true }), success: true });
};

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description = undefined }: ICategory = req.body;
  let existedCategory;

  // if (validator.isEmpty(name) || validator.isLength(name, {min: 3}))
  //   return next(new HttpError("Category name is empty!", 422));

  try {
    existedCategory = await CategoryModel.findOne({ name: name });
  } catch (e) {
    return next(new HttpError('Something went wrong while creating category.', 500));
  }

  if (existedCategory) {
    return next(new HttpError('Category name already exists! Pls, use another one.', 422));
  }

  const createdCategory = new CategoryModel({
    name,
    description,
  });

  try {
    const session: ClientSession = await startSession();
    session.startTransaction();
    await createdCategory.save({ session });
    await session.commitTransaction();
  } catch (e) {
    return next(new HttpError('Creating category failed.', 500));
  }

  return res.status(201).json({
    category: createdCategory.toObject({ getters: true }),
    success: true,
  });
};

const updateCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description = undefined }: ICategory = req.body;
  const categoryID: string = req.params.categoryID;
  let category, existedCategory;

  // if (validator.isEmpty(name) || validator.isLength(name, {min: 3}))
  //   return next(new HttpError("Category name is empty!", 422));

  try {
    existedCategory = await CategoryModel.findOne({ name: name });
  } catch (e) {
    return next(new HttpError('Something went wrong while updating category.', 500));
  }

  if (existedCategory) {
    return next(new HttpError('Category name already exists! Pls, use another one.', 422));
  }

  try {
    category = await CategoryModel.findById(categoryID);
  } catch (e) {
    return next(new HttpError('Something went wrong while searching for some category by category ID.', 500));
  }

  if (!category) {
    return next(new HttpError("Couldn't find a category for the provided category ID!", 404));
  }

  category.name = name;
  // if (!validator.isEmpty(description)) category.description = description;

  try {
    await category.save();
  } catch (e) {
    return next(new HttpError('Something went wrong while updating category.', 500));
  }

  return res.status(201).json({ category: category.toObject({ getters: true }), success: true });
};

const deleteCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  const categoryID: string = req.params.categoryID;
  let category;

  try {
    category = await CategoryModel.findById(categoryID);
  } catch (e) {
    return next(new HttpError('Something went wrong while searching for some category by category ID.', 500));
  }

  if (!category) {
    return next(new HttpError("Couldn't find a category for the provided category ID!", 404));
  }

  try {
    const session: ClientSession = await startSession();
    session.startTransaction();
    await category.deleteOne({ session });
    await session.commitTransaction();
  } catch (e) {
    return next(new HttpError('Something went wrong while deleting category.', 500));
  }

  return res.status(201).json({
    message: `Successful deleted category with ${categoryID} ID`,
    success: true,
  });
};

export { getCategories, getCategoryById, createCategory, updateCategoryById, deleteCategoryById };

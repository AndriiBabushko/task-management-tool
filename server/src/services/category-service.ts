import { ClientSession, startSession } from 'mongoose';

import { mongooseModel as CategoryModel } from '../models/category-model.js';
import { mongooseModel as TaskModel } from '../models/task-model.js';
import HttpError from '../exceptions/http-error.js';
import CategoryDto from '../DTO/category-dto.js';
import { ICategory } from '../ts/interfaces/ICategory.js';

class CategoryService {
  async getCategories() {
    let categories;

    try {
      categories = await CategoryModel.find();
    } catch (e) {
      throw new HttpError('Something went wrong while fetching categories data from DB.', 500);
    }

    return {
      categories: categories.map((c) => new CategoryDto(c)),
      success: true,
    };
  }

  async getCategoryByID(categoryID: string) {
    let category;

    try {
      category = await CategoryModel.findById(categoryID);
    } catch (e) {
      throw new HttpError('Something went wrong while searching for some category by category ID.', 500);
    }

    if (!category) {
      throw new HttpError("Couldn't find a category for the provided category ID!", 404);
    }

    const categoryDTO: CategoryDto = new CategoryDto(category);
    return { category: categoryDTO, success: true };
  }

  async createCategory({ name, description }: ICategory) {
    let createdCategory;

    try {
      createdCategory = await CategoryModel.create({
        name,
        description,
      });
    } catch (e) {
      throw new HttpError('Creating category failed!', 500);
    }

    const categoryDTO: CategoryDto = new CategoryDto(createdCategory);

    return {
      category: categoryDTO,
      success: true,
    };
  }

  async updateCategory(categoryID: string, { name, description }: ICategory) {
    let updatedCategory;

    try {
      updatedCategory = await CategoryModel.findById(categoryID);
    } catch (e) {
      throw new HttpError('Something went wrong while searching for some category by category ID.', 500);
    }

    if (!updatedCategory) {
      throw new HttpError("Couldn't find a category for the provided category ID!", 404);
    }

    if (name) updatedCategory.name = name;
    if (description) updatedCategory.description = description;

    try {
      await updatedCategory.save();
    } catch (e) {
      throw new HttpError('Something went wrong while updating category.', 500);
    }

    const categoryDTO: CategoryDto = new CategoryDto(updatedCategory);

    return {
      category: categoryDTO,
      success: true,
    };
  }

  async deleteCategory(categoryID: string) {
    let deletedCategory, tasks;

    try {
      tasks = await TaskModel.find().populate('tags');
      deletedCategory = await CategoryModel.findById(categoryID);
    } catch (e) {
      throw new HttpError('Something went wrong while searching for some data in DB.', 500);
    }

    if (!deletedCategory) {
      throw new HttpError("Couldn't find a category for the provided category ID!", 404);
    }

    try {
      const session: ClientSession = await startSession();
      session.startTransaction();

      for (const task of tasks) {
        await TaskModel.updateOne({ _id: task._id }, { $pull: { categories: deletedCategory._id } }, { session });
      }

      await deletedCategory.deleteOne({ session });
      await session.commitTransaction();
    } catch (e) {
      throw new HttpError('Something went wrong while deleting category.', 500);
    }

    return {
      success: true,
    };
  }
}

export default new CategoryService();

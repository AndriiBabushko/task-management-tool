import { mongooseModel as UserModel } from '../models/user-model.js';
import { mongooseModel as TaskModel } from '../models/task-model.js';
import { mongooseModel as CategoryModel } from '../models/category-model.js';
import { mongooseModel as TagModel } from '../models/tag-model.js';
import HttpError from '../exceptions/http-error.js';
import TaskDto from '../DTO/task-dto.js';
import { ITask } from '../ts/interfaces/ITask.js';
import { ClientSession, Document, startSession, Types } from 'mongoose';
import { IUser } from '../ts/interfaces/IUser.js';
import ImageService from './image-service.js';
import {
  isCompletedCountPipeline,
  theOldestTaskPipeline,
  userWithMaxTasksCreatedPipeline,
} from '../aggregates/task-aggregate.js';

class TaskService {
  async getTasks() {
    let tasks;

    try {
      tasks = await TaskModel.find().populate(['creator', 'tags', 'categories']);
    } catch (e) {
      throw new HttpError('Something went wrong while fetching tasks data from DB.', 500);
    }

    return {
      tasks: tasks.map((t) => new TaskDto(t)),
      success: true,
    };
  }

  async getTaskByID(taskID: string) {
    let task;

    try {
      task = await TaskModel.findById(taskID).populate(['creator', 'tags', 'categories']);
    } catch (e) {
      throw new HttpError('Something went wrong while searching for some task by task ID.', 500);
    }

    if (!task) {
      throw new HttpError("Couldn't find a task for the provided task ID!", 404);
    }

    const taskDTO: TaskDto = new TaskDto(task);
    return { task: taskDTO, success: true };
  }

  async getTaskByCreatorID(creatorID: string) {
    let tasks;

    try {
      tasks = await TaskModel.find({ creator: creatorID }).populate(['creator', 'tags', 'categories']);
    } catch (error) {
      throw new HttpError('Something went wrong while searching for some tasks by creator ID.', 500);
    }

    if (!tasks || tasks.length == 0) {
      throw new HttpError("Couldn't find tasks for the provided user ID!", 422);
    }

    return {
      tasks: tasks.map((t) => new TaskDto(t)),
      success: true,
    };
  }

  private async checkTaskData({ deadlineDate, tags, categories }: ITask, creatorID = null) {
    if (new Date(deadlineDate).getTime() <= new Date().getTime())
      throw new HttpError('Task deadline date is invalid!', 422);

    let identifiedCreator: Document<unknown, NonNullable<unknown>, IUser> &
        Omit<IUser & { _id: Types.ObjectId }, never>,
      identifiedTags: Awaited<void>[],
      identifiedCategories;

    if (creatorID != null) {
      try {
        identifiedCreator = await UserModel.findById(creatorID);
      } catch (e) {
        throw new HttpError("Couldn't find task creator for provided id!", 500);
      }

      if (!identifiedCreator) throw new HttpError("Couldn't find task creator for provided id.", 404);
    }

    if (categories && categories.length > 0) {
      try {
        identifiedCategories = await Promise.all(
          categories.map(async (c) => {
            let identifiedCategory;

            try {
              identifiedCategory = await CategoryModel.findById(c);
            } catch (e) {
              throw new HttpError("Couldn't find category for provided id!", 500);
            }

            if (!identifiedCategory) throw new HttpError("Couldn't find category for provided id.", 404);
          }),
        );
      } catch (e) {
        throw new HttpError(e.message, e.status);
      }
    }

    if (tags && Array.isArray(tags) && tags.length > 0) {
      try {
        identifiedTags = await Promise.all(
          tags.map(async (t) => {
            let identifiedTag;

            try {
              identifiedTag = await TagModel.findById(t);
            } catch (e) {
              throw new HttpError("Couldn't find tag for provided id!", 500);
            }

            if (!identifiedTag) {
              throw new HttpError("Couldn't find tag for provided id!", 404);
            }
          }),
        );
      } catch (e) {
        throw new HttpError(e.message, e.status);
      }
    }

    return {
      identifiedCreator,
      identifiedTags,
      identifiedCategories,
    };
  }

  async createTask(
    creatorID: Types.ObjectId,
    { title, description, deadlineDate, image, tags, categories, access }: ITask,
  ) {
    let createdTask, taskCheck;

    if (tags && !Array.isArray(tags)) tags = Array(tags);
    if (categories && !Array.isArray(categories)) categories = Array(categories);
    // if (tags && typeof tags === 'string') tags = JSON.parse(tags);
    // if (categories && typeof categories === 'string') categories = JSON.parse(categories);

    try {
      taskCheck = await this.checkTaskData({ deadlineDate, tags, categories }, creatorID);
    } catch (e) {
      throw e;
    }

    if (!(taskCheck instanceof HttpError)) {
      try {
        createdTask = await TaskModel.create({
          title,
          description,
          creationDate: new Date(),
          deadlineDate,
          creator: creatorID,
          image,
          tags,
          categories,
          access,
        });
      } catch (e) {
        throw new HttpError('Creating task failed!', 500);
      }

      try {
        const session: ClientSession = await startSession();
        session.startTransaction();
        await createdTask.save({ session });
        taskCheck.identifiedCreator.tasks.push(createdTask);
        await taskCheck.identifiedCreator.save({ session });
        await session.commitTransaction();
      } catch (e) {
        throw new HttpError('Creating task failed. Pls check credentials and try again.', 500);
      }

      const taskDTO: TaskDto = new TaskDto(createdTask);

      return {
        task: taskDTO,
        success: true,
      };
    }

    throw new HttpError(taskCheck.message, taskCheck.status);
  }

  async updateTask(
    taskID: string,
    userID: Types.ObjectId,
    { title, description, deadlineDate, image, tags, categories, access, isCompleted }: ITask,
  ) {
    let taskCheck;

    if (tags && !Array.isArray(tags)) tags = Array(tags);
    if (categories && !Array.isArray(categories)) categories = Array(categories);

    try {
      taskCheck = await this.checkTaskData({ deadlineDate, tags, categories });
    } catch (e) {
      throw new HttpError(e.message, 500);
    }

    if (!(taskCheck instanceof HttpError)) {
      let updatedTask;

      try {
        updatedTask = await TaskModel.findById(taskID).populate('creator');
      } catch (e) {
        throw new HttpError('Something went wrong while searching for some task by task ID.', 500);
      }

      if (!updatedTask) {
        throw new HttpError("Couldn't find a task for the provided task ID!", 404);
      }

      if (updatedTask.creator._id != userID) {
        throw new HttpError("No access to change task. Different user and creator id's.", 404);
      }

      ImageService.deleteImage(updatedTask, 'uploads/task/no_task_image.png');

      if (title) updatedTask.title = title;
      if (description) updatedTask.description = description;
      if (deadlineDate) updatedTask.deadlineDate = deadlineDate;
      if (image) updatedTask.image = image;
      if (tags) updatedTask.tags = tags;
      else updatedTask.tags = [];
      if (categories) updatedTask.categories = categories;
      else updatedTask.categories = [];
      if (access) updatedTask.access = access;
      if (isCompleted) updatedTask.isCompleted = isCompleted;

      try {
        await updatedTask.save();
      } catch (e) {
        throw new HttpError('Something went wrong while updating task.', 500);
      }

      const taskDto: TaskDto = new TaskDto(updatedTask);

      return {
        task: taskDto,
        success: true,
      };
    }

    throw new HttpError(taskCheck.message, taskCheck.status);
  }

  async deleteTask(taskID: string, userID: Types.ObjectId) {
    let deletedTask;

    try {
      deletedTask = await TaskModel.findById(taskID).populate({
        path: 'creator',
      });
    } catch (e) {
      throw new HttpError('Something went wrong while searching for some task by task ID.', 500);
    }

    if (!deletedTask) {
      throw new HttpError("Couldn't find a task for the provided task ID!", 404);
    }

    if (deletedTask.creator._id != userID) {
      throw new HttpError("No access to delete task. Different user and creator id's.", 404);
    }

    ImageService.deleteImage(deletedTask, 'uploads/task/no_task_image.png');

    try {
      const session: ClientSession = await startSession();
      session.startTransaction();
      await deletedTask.deleteOne({ session });
      deletedTask.creator.tasks.pull(deletedTask);
      await deletedTask.creator.save({ session });
      await session.commitTransaction();
    } catch (e) {
      throw new HttpError('Something went wrong while deleting task.', 500);
    }

    return {
      success: true,
    };
  }

  async getStatistics() {
    let completedTasksCount, theBestUserWithMaxTasks, theOldestTask;

    try {
      completedTasksCount = await TaskModel.aggregate(isCompletedCountPipeline);
      theBestUserWithMaxTasks = await TaskModel.aggregate(userWithMaxTasksCreatedPipeline);
      theOldestTask = await TaskModel.aggregate(theOldestTaskPipeline);
    } catch (e) {
      console.log(e);
      throw new HttpError('Something went wrong while collecting task stats.', 500);
    }

    return {
      success: true,
      theBestUser: theBestUserWithMaxTasks,
      completedTasksCount,
      theOldestTask,
    };
  }
}

export default new TaskService();

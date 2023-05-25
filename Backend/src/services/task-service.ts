import { ObjectId } from 'mongodb';

import { mongooseModel as UserModel } from '../models/user-model.js';
import { mongooseModel as TaskModel } from '../models/task-model.js';
import { mongooseModel as CategoryModel } from '../models/category-model.js';
import { mongooseModel as TagModel } from '../models/tag-model.js';
import HttpError from '../exceptions/http-error.js';
import TaskDto from '../DTO/task-dto.js';
import { ITask } from '../ts/interfaces/ITask.js';
import { ClientSession, Document, startSession, Types } from 'mongoose';
import { IUser } from '../ts/interfaces/IUser.js';
import { ICategory } from '../ts/interfaces/ICategory.js';

class TaskService {
  async getTasks() {
    let tasks;

    try {
      tasks = await TaskModel.find();
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
      task = await TaskModel.findById(taskID).populate('creator');
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
      tasks = await TaskModel.find({ creator: creatorID });
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

  private async checkTaskData(
    title: string,
    description: string,
    deadlineDate: Date,
    tags: ObjectId[],
    category: ObjectId,
    creatorID: string = null,
  ) {
    if (new Date(deadlineDate).getTime() <= new Date().getTime())
      throw new HttpError('Task deadline date is invalid!', 422);

    let identifiedCreator: Document<unknown, NonNullable<unknown>, IUser> &
        Omit<IUser & { _id: Types.ObjectId }, never>,
      identifiedTags: Awaited<void>[],
      identifiedCategory: Document<unknown, NonNullable<unknown>, ICategory> &
        Omit<ICategory & { _id: Types.ObjectId }, never>;

    if (creatorID != null) {
      try {
        identifiedCreator = await UserModel.findById(creatorID);
      } catch (e) {
        throw new HttpError("Couldn't find task creator for provided id!", 500);
      }

      if (!identifiedCreator) throw new HttpError("Couldn't find creator for provided id.", 404);
    }

    if (category) {
      try {
        identifiedCategory = await CategoryModel.findById(category);
      } catch (e) {
        throw new HttpError("Couldn't find category for provided id!", 500);
      }

      if (!identifiedCategory) throw new HttpError("Couldn't find category for provided id.", 404);
    }

    if (tags) {
      try {
        identifiedTags = await Promise.all(
          tags.map(async (t: ObjectId) => {
            let identifiedTag;

            try {
              identifiedTag = await TagModel.findById(t);
            } catch (e) {
              throw new HttpError("Couldn't find tag for provided id!", 500);
            }

            if (!identifiedTag) {
              throw new HttpError("Couldn't find tag for provided id!", 500);
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
      identifiedCategory,
    };
  }

  async createTask(creatorID: string, { title, description, deadlineDate, tags, category, access }: ITask) {
    let createdTask, taskCheck;

    try {
      taskCheck = await this.checkTaskData(title, description, deadlineDate, tags, category, creatorID);
    } catch (e) {
      throw new HttpError(e.message, e.status);
    }

    if (!(taskCheck instanceof HttpError)) {
      try {
        createdTask = await TaskModel.create({
          title,
          description,
          creationDate: new Date(),
          deadlineDate,
          creator: creatorID,
          tags,
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

    throw new HttpError(
      'Task data validation in DB failed while creating new task! Please, check credentials and try again.',
      500,
    );
  }

  async updateTask(
    taskID: string,
    userID: string,
    { title, description, deadlineDate, tags, category, access }: ITask,
  ) {
    let taskCheck;

    try {
      taskCheck = await this.checkTaskData(title, description, deadlineDate, tags, category);
    } catch (e) {
      console.log(e);
      throw new HttpError(
        'Something went wrong while checking task data. Please, check credentials and try again.',
        500,
      );
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

      if (title) updatedTask.title = title;
      if (description) updatedTask.description = description;
      if (deadlineDate) updatedTask.deadlineDate = deadlineDate;
      if (tags) updatedTask.tags = tags;
      if (category) updatedTask.category = category;
      if (access) updatedTask.access = access;

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

    throw new HttpError(
      'Task data validation in DB failed while updating new task! Please, check credentials and try again.',
      500,
    );
  }

  async deleteTask(taskID: string, userID: string) {
    let task;

    try {
      task = await TaskModel.findById(taskID).populate({
        path: 'creator',
      });
    } catch (e) {
      throw new HttpError('Something went wrong while searching for some task by task ID.', 500);
    }

    if (!task) {
      throw new HttpError("Couldn't find a task for the provided task ID!", 404);
    }

    if (task.creator._id != userID) {
      throw new HttpError("No access to delete task. Different user and creator id's.", 404);
    }

    try {
      const session: ClientSession = await startSession();
      session.startTransaction();
      await task.deleteOne({ session });
      task.creator.tasks.pull(task);
      await task.creator.save({ session });
      await session.commitTransaction();
    } catch (e) {
      throw new HttpError('Something went wrong while deleting task.', 500);
    }

    return {
      success: true,
    };
  }
}

export default new TaskService();

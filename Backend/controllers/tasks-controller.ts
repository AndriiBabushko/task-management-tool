import validator from "validator";
import { NextFunction, Request, Response } from "express";
import { startSession } from "mongoose";

import HttpError from "../models/http-error-model";
import { mongooseModel as TaskModel } from "../models/task-model";
import { mongooseModel as UserModel } from "../models/user-model";

const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  const taskID: string = req.params.taskID;

  let task;

  try {
    task = await TaskModel.findById(taskID);
  } catch (e) {
    return next(
      new HttpError(
        "Something went wrong while searching for some task by task ID.",
        500
      )
    );
  }

  if (!task) {
    return next(
      new HttpError("Couldn't find a task for the provided task ID!", 404)
    );
  }

  return res.json({ task: task.toObject({ getters: true }), success: true });
};

const getTasksByCreatorId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const creatorID: string = req.params.creatorID;
  let tasks;

  try {
    tasks = await TaskModel.find({ creator: creatorID });
  } catch (error) {
    return next(
      new HttpError(
        "Something went wrong while searching for some tasks by creator ID.",
        500
      )
    );
  }

  if (!tasks || tasks.length == 0) {
    return next(
      new HttpError("Couldn't find tasks for the provided user ID!", 422)
    );
  }

  return res.json({
    tasks: tasks.map((t) => t.toObject({ getters: true })),
    success: true,
  });
};

const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  let tasks;

  try {
    tasks = await TaskModel.find();
  } catch (e) {
    return next(
      new HttpError(
        "Something went wrong while fetching tasks data from DB.",
        500
      )
    );
  }

  return res.json({
    tasks: tasks.map((t) => t.toObject({ getters: true })),
    success: true,
  });
};

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  const {
    title,
    description,
    deadlineDate,
    creator,
    tags,
  }: {
    title: string;
    description: string;
    deadlineDate: string;
    creator: string;
    tags: string[];
  } = req.body;

  try {
    if (validator.isEmpty(title))
      return next(new HttpError("Task title is empty!", 422));

    if (validator.isEmpty(description))
      return next(new HttpError("Task description is empty!", 422));

    if (
      !validator.isDate(deadlineDate) ||
      validator.isEmpty(deadlineDate) ||
      new Date(deadlineDate).getTime() <= new Date().getTime()
    )
      return next(new HttpError("Task deadline date is invalid!", 422));
  } catch (e) {
    return next(
      new HttpError("Something went wrong while checking task data.", 500)
    );
  }

  const createdTask = new TaskModel({
    title,
    description,
    creationDate: new Date(),
    deadlineDate: new Date(deadlineDate),
    creator,
    tags,
  });
  let user;

  try {
    user = await UserModel.findById(creator);
  } catch (e) {
    return next(
      new HttpError(
        "Couldn't find user for provided id! Please, check credentials.",
        500
      )
    );
  }

  if(!user)
    return next(new HttpError("Couldn't find user for provided id.", 404))

  try {
    const session = await startSession();
    session.startTransaction();
    await createdTask.save({ session });
    user.tasks.push(createdTask);
    await user.save({ session });
    await session.commitTransaction();
  } catch (e) {
    return next(
      new HttpError(
        "Creating task failed. Pls check credentials and try again.",
        500
      )
    );
  }

  return res
    .status(201)
    .json({ task: createdTask.toObject({ getters: true }), success: true });
};

const updateTaskByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description }: { title: string; description: string } =
    req.body;
  let task;
  const taskID = req.params.taskID;

  if (validator.isEmpty(title))
    return next(new HttpError("Task title is empty!", 422));

  if (validator.isEmpty(description))
    return next(new HttpError("Task description is empty!", 422));

  try {
    task = await TaskModel.findById(taskID);
  } catch (e) {
    return next(
      new HttpError(
        "Something went wrong while searching for some task by task ID.",
        500
      )
    );
  }

  if (!task) {
    return next(
      new HttpError("Couldn't find a task for the provided task ID!", 404)
    );
  }

  task.title = title;
  task.description = description;

  try {
    await task.save();
  } catch (e) {
    return next(
      new HttpError("Something went wrong while updating task.", 500)
    );
  }

  return res
    .status(200)
    .json({ task: task.toObject({ getters: true }), success: true });
};

const deleteTaskByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let task;
  const taskID = req.params.taskID;

  try {
    task = await TaskModel.findById(taskID).populate("creator");
  } catch (e) {
    return next(
      new HttpError(
        "Something went wrong while searching for some task by task ID.",
        500
      )
    );
  }

  if (!task) {
    return next(
      new HttpError("Couldn't find a task for the provided task ID!", 404)
    );
  }

  try {
    const session = await startSession();
    session.startTransaction();
    await task.deleteOne({ session });
    task.creator.tasks.pull(task);
    await task.creator.save({ session });
    await session.commitTransaction();
  } catch (e) {
    return next(
      new HttpError("Something went wrong while deleting task.", 500)
    );
  }

  return res
    .status(200)
    .json({
      message: `Successful deleted task with ${taskID} ID.`,
      success: true,
    });
};

export {
  getTaskById,
  getTasksByCreatorId,
  getTasks,
  createTask,
  updateTaskByID,
  deleteTaskByID,
};

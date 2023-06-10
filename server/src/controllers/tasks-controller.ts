import { NextFunction, Request, Response } from 'express';

import HttpError from '../exceptions/http-error.js';
import { IUserDataRequest } from '../ts/interfaces/IUserDataRequest.js';
import TaskService from '../services/task-service.js';
import { validationResult } from 'express-validator';

const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskID: string = req.params.taskID;

    const taskData = await TaskService.getTaskByID(taskID);

    return res.status(200).json({ ...taskData, message: 'Fetching task by task ID is successful!' });
  } catch (e) {
    next(e);
  }
};

const getTasksByCreatorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const creatorID: string = req.params.creatorID;

    const tasksData = await TaskService.getTaskByCreatorID(creatorID);

    return res.status(200).json({ ...tasksData, message: 'Fetching tasks by creator ID is successful!' });
  } catch (e) {
    next(e);
  }
};

const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasksData = await TaskService.getTasks();

    return res.status(200).json({ ...tasksData, message: 'Fetching tasks is successful!' });
  } catch (e) {
    next(e);
  }
};

const createTask = async (req: IUserDataRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(HttpError.BadRequest('Create task validation error. Please, check your credentials.', errors.array()));
    }

    const { id: creatorID } = req.userData;
    const taskData = await TaskService.createTask(creatorID, req.body);

    return res.status(200).json({ ...taskData, message: 'Task is successfully created!' });
  } catch (e) {
    next(e);
  }
};

const updateTaskByID = async (req: IUserDataRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(HttpError.BadRequest('Update task validation error. Please, check your credentials.', errors.array()));
    }

    const taskID: string = req.params.taskID;
    const { id: userID } = req.userData;

    const taskData = await TaskService.updateTask(taskID, userID, req.body);

    return res.status(200).json({ ...taskData, message: 'Task is successfully updated!' });
  } catch (e) {
    next(e);
  }
};

const deleteTaskByID = async (req: IUserDataRequest, res: Response, next: NextFunction) => {
  try {
    const taskID: string = req.params.taskID;
    const { id: userID } = req.userData;

    const taskData = await TaskService.deleteTask(taskID, userID);

    return res.status(200).json({
      ...taskData,
      message: `Successful deleted task with ${taskID} ID.`,
    });
  } catch (e) {
    next(e);
  }
};

export { getTaskById, getTasksByCreatorId, getTasks, createTask, updateTaskByID, deleteTaskByID };

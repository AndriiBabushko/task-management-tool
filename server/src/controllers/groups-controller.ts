import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import GroupService from '../services/group-service.js';
import HttpError from '../exceptions/http-error.js';
import { IUserDataRequest } from '../ts/interfaces/IUserDataRequest.js';

const getGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groupsData = await GroupService.getGroups();

    return res.status(200).json(groupsData);
  } catch (e) {
    next(e);
  }
};

const getGroupById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groupID: string = req.params.groupID;

    const groupData = await GroupService.getGroupByID(groupID);

    return res.status(200).json(groupData);
  } catch (e) {
    next(e);
  }
};

const createGroup = async (req: IUserDataRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(HttpError.BadRequest('Create group validation error. Please, check your credentials.', errors.array()));
    }

    const { id: creatorID } = req.userData;
    const groupData = await GroupService.createGroup(creatorID, req.body);

    return res.status(200).json({ ...groupData, message: 'Group is successfully created!' });
  } catch (e) {
    next(e);
  }
};

const updateGroupById = async (req: IUserDataRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(HttpError.BadRequest('Update group validation error. Please, check your credentials.', errors.array()));
    }

    const groupID: string = req.params.groupID;
    const { id: userID } = req.userData;
    const userData = await GroupService.updateGroup(groupID, userID, req.body);

    return res.status(200).json({ ...userData, message: 'Group is successfully updated!' });
  } catch (e) {
    next(e);
  }
};

const deleteGroupById = async (req: IUserDataRequest, res: Response, next: NextFunction) => {
  try {
    const groupID: string = req.params.groupID;
    const { id: userID } = req.userData;

    const taskData = await GroupService.deleteGroup(groupID, userID);

    return res.status(200).json({
      ...taskData,
      message: `Successful deleted group with ${groupID} ID.`,
    });
  } catch (e) {
    next(e);
  }
};

export { getGroups, getGroupById, createGroup, updateGroupById, deleteGroupById };

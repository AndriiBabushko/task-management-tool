import { NextFunction, Request, Response } from "express";

import { mongooseModel as GroupModel } from "../models/group-model.js";
import HttpError from "../exceptions/http-error.js";
import {IGroup} from "../ts/interfaces/IGroup.js";

const getGroups = async (req: Request, res: Response, next: NextFunction) => {
  let groups;

  try {
    groups = await GroupModel.find();
  } catch (e) {
    return next(
      new HttpError(
        "Something went wrong while fetching groups data from DB.",
        500
      )
    );
  }

  return res.status(201).json({
    groups: groups.map((g) => g.toObject({ getters: true })),
    success: true,
  });
};

const getGroupById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const groupID: string = req.params.groupID;

  let group;

  try {
    group = await GroupModel.findById(groupID).populate("creator");
  } catch (e) {
    return next(
      new HttpError(
        "Something went wrong while searching for some group by group ID.",
        500
      )
    );
  }

  if (!group) {
    return next(
      new HttpError("Couldn't find a category for the provided group ID!", 404)
    );
  }

  return res
    .status(201)
    .json({ group: group.toObject({ getters: true }), success: true });
};

const createGroup = (req: Request, res: Response, next: NextFunction) => {
  let {name, description = "", image = "", access = ""}: IGroup = req.body;

  // if(validator.isEmpty(name) || name.length < 3)
  //   return next(new HttpError("Group is entered incorrect!", 422));

  const createdGroup = new GroupModel({
    name, description
  })
};

const updateGroupById = (req: Request, res: Response, next: NextFunction) => {};

const deleteGroupById = (req: Request, res: Response, next: NextFunction) => {};

export {
  getGroups,
  getGroupById,
  createGroup,
  updateGroupById,
  deleteGroupById,
};

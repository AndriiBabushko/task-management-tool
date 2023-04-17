import validator from "validator";
import { NextFunction, Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import HttpError from "../models/http-error-model";
import { mongooseModel as UserModel } from "../models/user-model";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  let users;

  try {
    users = await UserModel.find({}, "-password");
  } catch (e) {
    return next(
      new HttpError(
        "Something went wrong while fetching users data from DB.",
        500
      )
    );
  }

  return res.json({
    users: users.map((u) => u.toObject({ getters: true })),
    success: true,
  });
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const {
    username,
    email,
    password,
  }: { username: string; email: string; password: string } = req.body;
  let indentifiedUser;

  try {
    indentifiedUser = await UserModel.findOne({ email: email });
  } catch (e) {
    return next(
      new HttpError(
        "Something went wrong while singing up! Please, try again.",
        500
      )
    );
  }

  if (indentifiedUser) {
    return next(
      new HttpError("User already exists! Please, login instead.", 422)
    );
  }

  if (!validator.normalizeEmail(email) && !validator.isEmail(email))
    return next(new HttpError("Email seem to be wrong.", 422));

  if (!validator.isLength(username, { min: 2 }))
    return next(new HttpError("Username has less than 2 symbols.", 422));

  if (validator.isEmpty(password))
    return next(new HttpError("Password is empty.", 422));

  let cryptPassword;
  try {
    cryptPassword = await bcrypt.hash(password, 12);
  } catch (e) {
    return next(
      new HttpError("Couldn't hash password. Please try again.", 500)
    );
  }

  const createdUser = new UserModel({
    username,
    email,
    image:
      "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
    password: cryptPassword,
  });

  try {
    await createdUser.save();
  } catch (e) {
    return next(
      new HttpError(
        "Signing up failed. Please check credentials and try again.",
        500
      )
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "task_management_tool_token",
      { expiresIn: "1h" }
    );
  } catch (e) {
    return next(new HttpError("Signing up failed! Please try again.", 500));
  }

  return res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    token,
    message: "Successfully signed up!",
    success: true,
  });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: { email: string; password: string } = req.body;
  let indentifiedUser;

  if (!validator.normalizeEmail(email) && !validator.isEmail(email))
    return next(new HttpError("Entered email seem to be wrong.", 422));

  if (validator.isEmpty(password))
    return next(new HttpError("Password is empty.", 422));

  try {
    indentifiedUser = await UserModel.findOne({ email: email });
  } catch (e) {
    return next(
      new HttpError(
        "Something went wrong while logging up! Please, try again.",
        500
      )
    );
  }

  if (!indentifiedUser) {
    return next(
      new HttpError(
        "Can't find such user! Please, check your credentials.",
        401
      )
    );
  }

  let isValidPassword: boolean = false;
  try {
    isValidPassword = await bcrypt.compare(password, indentifiedUser.password);
  } catch (e) {
    return next(
      new HttpError(
        "Couldn't log you in! Please, check your credentials and try again.",
        500
      )
    );
  }

  if (!isValidPassword) {
    return next(
      new HttpError("Password is incorrect! Please, try again.", 401)
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: indentifiedUser.id, email: indentifiedUser.email },
      "task_management_tool_token",
      { expiresIn: "1h" }
    );
  } catch (e) {
    return next(new HttpError("Logging in failed! Please try again.", 500));
  }

  return res.json({
    userId: indentifiedUser.id,
    email: indentifiedUser.email,
    token,
    message: "Successfully logged in!",
    success: true,
  });
};

export { getAllUsers, login, signup };

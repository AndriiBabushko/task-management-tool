import { NextFunction, Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import {validationResult} from "express-validator";

import HttpError from "../exceptions/http-error.js";
import { mongooseModel as UserModel } from "../models/user-model.js";
import { IUser } from "../ts/interfaces/IUser.js";
import UserService from "../services/user-service.js";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.getUsers();

    return res.status(200).json(users);
  } catch (e) {
    next(e);
  }
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      next(HttpError.BadRequest("Signup validation error. Please, check credentials.", errors.array()))
    }

    const { username, email, password }: IUser = req.body;
    const userData = await UserService.signup(username, email, password);

    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
    });

    return res
      .status(200)
      .json({ ...userData, message: "Successfully signed up!" });
  } catch (e) {
    return next(e);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      next(HttpError.BadRequest("Login validation error. Please, check credentials.", errors.array()))
    }

    const { email, password }: IUser = req.body;
    let indentifiedUser;

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
  } catch (e) {
    next(e);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {};

const activateLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activationLink: string = req.params.link;

    await UserService.activate(activationLink);

    return res.redirect(process.env.CLIENT_URL);
  } catch (e) {
    return next(e);
  }
};

const refreshLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export { getUsers, login, signup, activateLink, refreshLink, logout };

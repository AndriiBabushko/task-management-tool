import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import HttpError from '../exceptions/http-error.js';
import { IUser } from '../ts/interfaces/IUser.js';
import UserService from '../services/user-service.js';
import { IUserDataRequest } from '../ts/interfaces/IUserDataRequest.js';
import * as fs from 'fs';
import path from 'path';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.getUsers();

    return res.status(200).json(users);
  } catch (e) {
    next(e);
  }
};

const signup = async (req: IUserDataRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(HttpError.BadRequest('Signup validation error. Please, check credentials.', errors.array()));
    }

    const userData = await UserService.signup({ ...req.body, image: req.file?.path });

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json({ ...userData, message: 'Successfully signed up!' });
  } catch (e) {
    return next(e);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(HttpError.BadRequest('Login validation error. Please, check credentials.', errors.array()));
    }

    const { email, password }: IUser = req.body;
    const userData = await UserService.login(email, password);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json({ ...userData, message: 'Successfully logged in!' });
  } catch (e) {
    next(e);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await UserService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return res.status(200).json({ ...token, message: 'Successfully logged out!' });
  } catch (e) {
    return next(e);
  }
};

const activateLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activationLink: string = req.params.link;

    await UserService.activate(activationLink);

    return res.redirect(process.env.CLIENT_URL);
  } catch (e) {
    return next(e);
  }
};

const refreshLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;

    const userData = await UserService.refresh(refreshToken);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json(userData);
  } catch (e) {
    next(e);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(HttpError.BadRequest('Update user validation error. Please, check your credentials.', errors.array()));
    }

    const userID: string = req.params.userID;

    const userData = await UserService.updateUser(userID, req.body);

    return res.status(200).json({ ...userData, message: 'User is successfully updated!' });
  } catch (e) {
    next(e);
  }
};

const deleteUser = async (req: IUserDataRequest, res: Response, next: NextFunction) => {
  try {
    const userID: string = req.params.userID;

    const userData = await UserService.deleteUser(userID);

    return res.status(200).json({
      ...userData,
      message: `Successful deleted user with ${userID} ID.`,
    });
  } catch (e) {
    next(e);
  }
};

const getImage = (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'uploads/user', imageName);
    res.sendFile(imagePath);
  } catch (e) {
    next(e);
  }
};

export { getUsers, login, signup, activateLink, refreshLink, logout, updateUser, deleteUser, getImage };

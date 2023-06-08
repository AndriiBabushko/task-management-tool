import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { mongooseModel as UserModel } from '../models/user-model.js';
import { mongooseModel as RoleModel } from '../models/role-model.js';
import { mongooseModel as GroupModel } from '../models/group-model.js';
import { mongooseModel as TaskModel } from '../models/task-model.js';
import MailService from './mail-service.js';
import TokenService from './token-service.js';
import UserDto from '../DTO/user-dto.js';
import HttpError from '../exceptions/http-error.js';
import { IUser } from '../ts/interfaces/IUser.js';
import { ClientSession, startSession } from 'mongoose';

class UserService {
  async signup({ name, surname, username, email, password, image }: IUser) {
    let indentifiedUser;

    try {
      indentifiedUser = await UserModel.findOne({ email: email });
    } catch (e) {
      throw new HttpError('Something went wrong while singing up! Please, try again.', 500);
    }

    if (indentifiedUser) {
      throw HttpError.BadRequest(
        `User with email address ${email} already exists! Please, choose another email and try again.`,
      );
    }

    let hashPassword: string;

    try {
      hashPassword = await bcrypt.hash(password, 4);
    } catch (e) {
      throw new HttpError("Couldn't hash password. Please try again.", 500);
    }

    const activationLink: string = uuidv4();

    try {
      await MailService.sendActivationMail(email, `${process.env.API_URL}/api/users/activate/${activationLink}`);
    } catch (e) {
      throw new HttpError('Something went wrong while sending activation mail. Pls, try again!', 500);
    }

    let user;

    try {
      user = await UserModel.create({
        name,
        surname,
        username,
        email,
        password: hashPassword,
        image,
        activationLink,
      });
    } catch (e) {
      throw new HttpError(
        'Signing up failed. Please check credentials and try again. Maybe you are using username or email that is already used.',
        500,
      );
    }

    const userDTO: UserDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDTO });
    await TokenService.saveToken(userDTO.id, tokens.refreshToken);

    try {
      await TokenService.saveToken(userDTO.id, tokens.refreshToken);
    } catch (e) {
      throw new HttpError('Signing up failed! Please try again.', 500);
    }

    return {
      success: true,
      ...tokens,
      user: userDTO,
    };
  }

  async login(email: string, password: string) {
    let user;

    try {
      user = await UserModel.findOne({ email: email });
    } catch (e) {
      throw new HttpError('Something went wrong while logging up! Please, try again.', 500);
    }

    if (!user) {
      throw HttpError.BadRequest(`Can't find user with ${email} email! Please, check your credentials.`);
    }

    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, user.password);
    } catch (e) {
      throw new HttpError("Couldn't log you in! Please, check your credentials and try again.", 500);
    }

    if (!isValidPassword) {
      throw HttpError.BadRequest('Password is incorrect! Please, try again.');
    }

    const userDTO: UserDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDTO });
    await TokenService.saveToken(userDTO.id, tokens.refreshToken);

    return {
      success: true,
      ...tokens,
      user: userDTO,
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw HttpError.UnauthorizedError();
    }

    let token;

    try {
      token = await TokenService.removeToken(refreshToken);
    } catch (e) {
      throw new HttpError("Token doesn't exist! Please, try again.", 500);
    }

    return token;
  }

  async activate(activationLink: string) {
    let user;

    try {
      user = await UserModel.findOne({ activationLink });
    } catch (e) {
      throw new HttpError('Something went wrong while searching for user to activate account! Please, try again.', 500);
    }

    if (!user) throw new HttpError('Incorrect activation link!', 422);

    user.isActivated = true;

    try {
      await user.save();
    } catch (e) {
      throw new HttpError('Something went wrong while saving user after activating! Please, try again.', 500);
    }
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw HttpError.UnauthorizedError();

    const userData = TokenService.validateRefreshToken(refreshToken);
    const token = await TokenService.findToken(refreshToken);

    if (!userData || !token) {
      throw HttpError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.id);
    const userDTO = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDTO });

    await TokenService.saveToken(userDTO.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDTO,
    };
  }

  async getUsers() {
    let users;

    try {
      users = await UserModel.find({}, '-password');
    } catch (e) {
      throw new HttpError('Something went wrong while fetching users data.', 500);
    }

    return {
      users: users.map((u) => new UserDto(u)),
      success: true,
    };
  }

  private async checkUserData({ roles, groups }) {
    let identifiedRoles, identifiedGroups;

    if (roles) {
      try {
        identifiedRoles = await Promise.all(
          roles.map(async (r) => {
            let identifiedRole;

            try {
              identifiedRole = await RoleModel.findById(r);
            } catch (e) {
              throw new HttpError("Couldn't find role for provided id!", 500);
            }

            if (!identifiedRole) throw new HttpError("Couldn't find role for provided id.", 404);
          }),
        );
      } catch (e) {
        throw new HttpError(e.message, e.status);
      }
    }

    if (groups) {
      try {
        identifiedGroups = await Promise.all(
          groups.map(async (g) => {
            let identifiedGroup;

            try {
              identifiedGroup = await GroupModel.findById(g);
            } catch (e) {
              throw new HttpError("Couldn't find group for provided id!", 500);
            }

            if (!identifiedGroup) throw new HttpError("Couldn't find group for provided id.", 404);
          }),
        );
      } catch (e) {
        throw new HttpError(e.message, e.status);
      }
    }

    return {
      identifiedRoles,
      identifiedGroups,
    };
  }

  async updateUser(userID: string, { name, surname, username, password, image, roles, groups }: IUser) {
    let userCheck;

    try {
      userCheck = await this.checkUserData({ roles, groups });
    } catch (e) {
      throw new HttpError(e.message, e.status);
    }

    if (!(userCheck instanceof HttpError)) {
      let updatedUser;

      try {
        updatedUser = await UserModel.findById(userID).populate('tasks').populate('roles').populate('groups');
      } catch (e) {
        throw new HttpError('Something went wrong while searching for some user by user ID.', 500);
      }

      if (!updatedUser) {
        throw new HttpError("Couldn't find a user for the provided user ID!", 404);
      }

      if (name) updatedUser.name = name;
      if (surname) updatedUser.surname = surname;
      if (username) updatedUser.username = username;
      if (password) updatedUser.password = password;
      if (image) updatedUser.image = image;
      if (roles) updatedUser.roles = roles;
      if (groups) updatedUser.groups = groups;

      try {
        await updatedUser.save();
      } catch (e) {
        throw new HttpError('Something went wrong while updating user.', 500);
      }

      const userDTO: UserDto = new UserDto(updatedUser);

      return {
        user: userDTO,
        success: true,
      };
    }

    throw new HttpError(
      'User data validation in DB failed while updating new user! Please, check credentials and try again.',
      500,
    );
  }

  async deleteUser(userID: string) {
    let deletedUser, deletedUserTasks;

    try {
      deletedUser = await UserModel.findById(userID).populate('groups');
      deletedUserTasks = await TaskModel.find({ creator: userID });
    } catch (e) {
      throw new HttpError('Something went wrong while searching for some user by user ID.', 500);
    }

    if (!deletedUser) {
      throw new HttpError("Couldn't find a user for the provided user ID!", 404);
    }

    try {
      const session: ClientSession = await startSession();
      session.startTransaction();

      await deletedUserTasks.deleteMany({ session });
      await GroupModel.updateMany({ users: { $in: [userID] } }, { $pull: { users: userID } }, { session });
      await GroupModel.updateMany({ creator: userID }, { creator: null }, { session });

      await deletedUser.deleteOne({ session });
      await session.commitTransaction();
    } catch (e) {
      throw new HttpError('Something went wrong while deleting task.', 500);
    }

    return {
      success: true,
    };
  }
}

export default new UserService();

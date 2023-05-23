import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { mongooseModel as UserModel } from "../models/user-model.js";
import MailService from "./mail-service.js";
import TokenService from "./token-service.js";
import UserDto from "../DTO/user-dto.js";
import HttpError from "../exceptions/http-error.js";

class UserService {
  async signup(username: string, email: string, password: string) {
    let indentifiedUser;

    try {
      indentifiedUser = await UserModel.findOne({ email: email });
    } catch (e) {
      throw new HttpError(
        "Something went wrong while singing up! Please, try again.",
        500
      );
    }

    if (indentifiedUser) {
      throw HttpError.BadRequest(
        `User with email address ${email} already exists! Please, choose another email and try again.`
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
      await MailService.sendActivationMail(
        email,
        `${process.env.API_URL}/api/users/activate/${activationLink}`
      );
    } catch (e) {
      throw new HttpError(
        "Something went wrong while sending activation mail. Pls, try again!",
        500
      );
    }

    let user;

    try {
      user = await UserModel.create({
        username,
        email,
        password: hashPassword,
        activationLink,
      });
    } catch (e) {
      throw new HttpError(
        "Signing up failed. Please check credentials and try again.",
        500
      );
    }

    const userDTO: UserDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDTO });

    try {
      await TokenService.saveToken(userDTO.id, tokens.refreshToken);
    } catch (e) {
      throw new HttpError("Signing up failed! Please try again.", 500);
    }

    return {
      success: true,
      ...tokens,
      user: userDTO,
    };
  }

  async activate(activationLink: string) {
    let user;

    try {
      user = await UserModel.findOne({ activationLink });
    } catch (e) {
      throw new HttpError(
        "Something went wrong while searching for user to activate account! Please, try again.",
        500
      );
    }

    if (!user) throw new HttpError("Incorrect activation link!", 422);

    user.isActivated = true;

    try {
      await user.save();
    } catch (e) {
      throw new HttpError(
        "Something went wrong while saving user after activating! Please, try again.",
        500
      );
    }
  }

  async getUsers() {
    let users;

    try {
      users = await UserModel.find({}, "-password");
    } catch (e) {
      throw new HttpError(
        "Something went wrong while fetching users data.",
        500
      );
    }

    return {
      users: users.map((u) => u.toObject({ getters: true })),
      success: true,
    };
  }
}

export default new UserService();

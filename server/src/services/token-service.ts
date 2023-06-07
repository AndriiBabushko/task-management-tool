import jwt from 'jsonwebtoken';

import { mongooseModel as TokenModel } from '../models/token-model.js';
import HttpError from '../exceptions/http-error.js';

class TokenService {
  generateTokens(payload) {
    const accessToken: string = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken: string = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  validateRefreshToken(refreshToken: string) {
    let userData;

    try {
      userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      return null;
    }

    return userData;
  }

  validateAccessToken(accessToken: string) {
    let userData;

    try {
      userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    } catch (e) {
      return null;
    }

    return userData;
  }

  async saveToken(userID: string, refreshToken: string) {
    const tokenData = await TokenModel.findOne({ user: userID });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    return TokenModel.create({ user: userID, refreshToken });
  }

  async findToken(refreshToken: string) {
    let tokenData;

    try {
      tokenData = await TokenModel.findOne({ refreshToken });
    } catch (e) {
      throw new HttpError("Can't find refresh token in DB! Please, try again.", 500);
    }

    return tokenData;
  }

  async removeToken(refreshToken: string) {
    let tokenData;

    try {
      tokenData = await TokenModel.deleteOne({ refreshToken });
    } catch (e) {
      throw new HttpError("Can't delete refresh token from DB! Please, try again.", 500);
    }

    return tokenData;
  }
}

export default new TokenService();

import * as jwt from "jsonwebtoken";

import { mongooseModel as TokenModel } from "../models/token-model.js";

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userID, refreshToken) {
    const tokenData = await TokenModel.findOne({ user: userID });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = TokenModel.create({ user: userID, refreshToken });

    return token;
  }
}

export default new TokenService();
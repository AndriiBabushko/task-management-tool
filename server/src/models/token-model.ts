import { model, Schema, Types } from "mongoose";
import { IToken } from "../ts/interfaces/IToken.js";

const tokenSchema = new Schema<IToken>({
  user: { type: Types.ObjectId, ref: "User" },
  refreshToken: { type: String, required: true },
});

const mongooseModel = model<IToken>("Token", tokenSchema);

export { mongooseModel };

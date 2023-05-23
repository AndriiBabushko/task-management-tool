import { Types } from "mongoose";

export interface IToken extends Document {
  user: { type: Types.ObjectId };
  refreshToken: string;
}

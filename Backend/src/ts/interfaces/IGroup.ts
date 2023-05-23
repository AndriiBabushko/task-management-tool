import { Types } from "mongoose";

export interface IGroup extends Document {
  name: string;
  description?: string;
  image?: string;
  users?: Types.ObjectId[];
  creator: { type: Types.ObjectId };
  access: string;
}

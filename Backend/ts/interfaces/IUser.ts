import { Types } from "mongoose";

export interface IUser extends Document {
  id: string;
  name?: string;
  surname?: string;
  username: string;
  email: string;
  password: string;
  image: string;
  tasks: [{ type: Types.ObjectId }];
}

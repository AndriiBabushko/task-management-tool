import { Types } from "mongoose";

export interface IUser extends Document {
  name: string,
  surname: string,
  username: string,
  email: string,
  password: string,
  image: string,
  tasks: Types.ObjectId[],
  roles: Types.ObjectId[],
  groups: Types.ObjectId[],
  isActivated: boolean
  activationLink: string,
}

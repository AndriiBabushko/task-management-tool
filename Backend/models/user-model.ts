import { model, Schema, Types } from "mongoose";
import { IUser } from "../ts/interfaces/IUser";

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, minLength: 2 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
  image: { type: String, required: true },
  tasks: [{ type: Types.ObjectId, required: true, ref: "Task" }],
});

const mongooseModel = model<IUser>("User", userSchema);

export { mongooseModel };
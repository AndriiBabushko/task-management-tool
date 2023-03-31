import { model, Schema, Types } from "mongoose";
import { ITask } from "../ts/interfaces/ITask";

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creationDate: { type: Date, required: true },
  deadlineDate: { type: Date, required: false },
  creator: { type: Types.ObjectId, required: true, ref: "User" },
  tags: [{ type: String, required: false }],
});

const mongooseModel = model<ITask>("Task", taskSchema);

export { mongooseModel };

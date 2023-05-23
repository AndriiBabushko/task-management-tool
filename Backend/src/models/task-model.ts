import { model, Schema, Types } from "mongoose";
import { ITask } from "../ts/interfaces/ITask.js";

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: {
    type: String,
    required: false,
    default: "No description yet...",
  },
  creationDate: { type: Date, required: true },
  deadlineDate: { type: Date, required: false, default: null },
  creator: { type: Types.ObjectId, required: true, ref: "User" },
  tags: [{ type: Types.ObjectId, required: false, ref: "Tag" }],
  category: { type: Types.ObjectId, required: false, ref: "Category" },
  access: { type: String, required: true, default: "private" },
});

const mongooseModel = model<ITask>("Task", taskSchema);

export { mongooseModel };

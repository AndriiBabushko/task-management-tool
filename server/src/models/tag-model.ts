import { model, Schema } from "mongoose";
import { ITag } from "../ts/interfaces/ITag.js";

const tagSchema = new Schema<ITag>({
  name: { type: String, required: true, minlength: 3 },
  description: {
    type: String,
    required: false,
    default: "No description yet...",
  },
});

const mongooseModel = model<ITag>("Tag", tagSchema);

export { mongooseModel };

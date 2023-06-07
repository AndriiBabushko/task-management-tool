import { model, Schema } from "mongoose";
import { ICategory } from "../ts/interfaces/ICategory.js";

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, minlength: 3 },
  description: {
    type: String,
    required: false,
    default: "No description yet...",
  },
});

const mongooseModel = model<ICategory>("Category", categorySchema);

export { mongooseModel };

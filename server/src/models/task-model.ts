import { model, Schema, Types } from 'mongoose';
import { ITaskModel } from '../ts/interfaces/ITaskModel.js';

const taskSchema = new Schema<ITaskModel>({
  title: { type: String, required: true },
  description: {
    type: String,
    required: false,
    default: 'No description yet...',
  },
  creationDate: { type: Date, required: true },
  deadlineDate: { type: Date, required: false, default: null, index: { expires: '0s' } },
  image: { type: String, required: false, default: 'uploads/task/no_task_image.png' },
  creator: { type: Types.ObjectId, required: true, ref: 'User' },
  tags: [{ type: Types.ObjectId, required: false, ref: 'Tag' }],
  categories: [{ type: Types.ObjectId, required: false, ref: 'Category' }],
  access: { type: String, required: true, default: 'private' },
  isCompleted: { type: Boolean, required: true, default: false },
});

const mongooseModel = model<ITaskModel>('Task', taskSchema);

export { mongooseModel };

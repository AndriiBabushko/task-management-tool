import { model, Schema, Types } from 'mongoose';
import { ITask } from '../ts/interfaces/ITask.js';

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: {
    type: String,
    required: false,
    default: 'No description yet...',
  },
  creationDate: { type: Date, required: true },
  deadlineDate: { type: Date, required: false, default: null, index: { expires: '0s' } },
  creator: { type: Types.ObjectId, required: true, ref: 'User' },
  tags: [{ type: Types.ObjectId, required: false, ref: 'Tag' }],
  categories: [{ type: Types.ObjectId, required: false, ref: 'Category' }],
  access: { type: String, required: true, default: 'private' },
  isCompleted: { type: Boolean, required: true, default: false },
});

const mongooseModel = model<ITask>('Task', taskSchema);

export { mongooseModel };

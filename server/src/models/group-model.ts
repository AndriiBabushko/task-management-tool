import { model, Schema, Types } from 'mongoose';
import { IGroup } from '../ts/interfaces/IGroup.js';

const groupSchema = new Schema<IGroup>({
  name: { type: String, required: true, minlength: 3 },
  description: {
    type: String,
    required: false,
    default: 'No description yet...',
  },
  image: { type: String, required: false, default: 'no_image.jpg' },
  users: [{ type: Types.ObjectId, required: true, ref: 'User' }],
  creator: { type: Types.ObjectId, required: true },
  access: { type: String, required: true, default: 'private' },
});

const mongooseModel = model<IGroup>('Group', groupSchema);

export { mongooseModel };

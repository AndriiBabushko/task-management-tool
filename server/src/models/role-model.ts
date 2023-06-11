import { model, Schema } from 'mongoose';
import { IRole } from '../ts/interfaces/IRole.js';

const roleSchema = new Schema({
  name: { type: String, required: true, minlength: 3 },
  description: {
    type: String,
    required: false,
    default: 'No description yet...',
  },
});

const mongooseModel = model<IRole>('Role', roleSchema);

export { mongooseModel };

import { model, Schema, Types } from 'mongoose';
import { IUser } from '../ts/interfaces/IUser.js';

const userSchema = new Schema<IUser>({
  name: { type: String, required: false, minLength: 2, maxlength: 24, default: 'Unknown' },
  surname: { type: String, required: false, minlength: 2, maxlength: 24, default: 'Unknown' },
  username: { type: String, required: true, unique: true, minLength: 3, maxlength: 15 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
  image: { type: String, required: false, default: 'uploads/user/no_user_image.jpg' },
  tasks: [{ type: Types.ObjectId, required: false, ref: 'Task' }],
  roles: [{ type: Types.ObjectId, required: false, ref: 'Role' }],
  groups: [{ type: Types.ObjectId, required: false, ref: 'Group' }],
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
});

const mongooseModel = model<IUser>('User', userSchema);

export { mongooseModel };

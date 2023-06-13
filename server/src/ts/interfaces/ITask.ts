import { Types } from 'mongoose';

export interface ITask {
  id?: string;
  title?: string;
  description?: string;
  creationDate?: Date;
  deadlineDate?: Date;
  image?: string;
  creator?: { type: Types.ObjectId };
  tags?: Types.ObjectId[];
  categories?: Types.ObjectId[];
  access?: string;
  isCompleted?: boolean;
}

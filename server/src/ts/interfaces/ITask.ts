import { Document, Types } from 'mongoose';

export interface ITask extends Document {
  id: string;
  title: string;
  description?: string;
  creationDate: Date;
  deadlineDate?: Date;
  creator: { type: Types.ObjectId };
  tags?: Types.ObjectId[];
  categories?: Types.ObjectId[];
  access: string;
  isCompleted: boolean;
}

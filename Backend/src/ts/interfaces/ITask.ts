import { ObjectId } from 'mongodb';

export interface ITask extends Document {
  id: string;
  title: string;
  description?: string;
  creationDate: Date;
  deadlineDate?: Date;
  creator: ObjectId;
  tags?: ObjectId[];
  category?: ObjectId;
  access: string;
}

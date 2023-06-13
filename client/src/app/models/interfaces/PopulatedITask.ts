import { IUser } from './IUser';
import { ITag } from './ITag';
import { ICategory } from './ICategory';

export interface PopulatedITask {
  id: string;
  title: string;
  description: string;
  creationDate: Date;
  deadlineDate: Date;
  image: string;
  creator: IUser;
  tags: ITag[];
  categories: ICategory[];
  access: string;
  isCompleted: boolean;
}

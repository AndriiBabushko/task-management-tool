export interface ITask {
  id: string;
  title: string;
  description: string;
  creationDate: Date;
  deadlineDate: Date;
  creator: string;
  tags: string[];
  categories: string[];
  access: string;
  isCompleted: boolean;
}

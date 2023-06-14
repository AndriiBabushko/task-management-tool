import { ITask } from '../interfaces/ITask';
import { IUser } from '../interfaces/IUser';

export interface TaskStatisticsResponse {
  success: boolean;
  message: string;
  theBestUser: { _id: string; user: IUser; tasks: ITask[]; taskCount: number }[];
  completedTasksCount: { total: number }[];
  theOldestTask: ITask[];
}

import { ITask } from '../interfaces/ITask';

export interface TasksResponse {
  success: boolean;
  message: string;
  tasks: ITask[];
}

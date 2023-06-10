import { ITask } from '../interfaces/ITask';

export interface TaskResponse {
  success: boolean;
  message: string;
  task: ITask;
}

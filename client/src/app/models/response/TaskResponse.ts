import { PopulatedITask } from '../interfaces/PopulatedITask';

export interface TaskResponse {
  success: boolean;
  message: string;
  task: PopulatedITask;
}

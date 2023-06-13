import { PopulatedITask } from '../interfaces/PopulatedITask';

export interface TasksResponse {
  success: boolean;
  message: string;
  tasks: PopulatedITask[];
}

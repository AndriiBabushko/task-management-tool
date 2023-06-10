import { AxiosResponse } from 'axios';
import { TaskResponse } from '../models/response/TaskResponse';
import { axiosInstance } from '../utils/axios';
import { TasksResponse } from '../models/response/TasksResponse';

export default class TaskService {
  static async fetchTasks(): Promise<AxiosResponse<TasksResponse>> {
    return axiosInstance.get<TasksResponse>('/tasks/');
  }

  static async fetchTaskByID(taskID: string): Promise<AxiosResponse<TaskResponse>> {
    return axiosInstance.get<TaskResponse>(`/tasks/${taskID}`);
  }
}

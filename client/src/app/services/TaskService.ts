import { AxiosResponse } from 'axios';
import { TaskResponse } from '../models/response/TaskResponse';
import { axiosInstance } from '../utils/axios';
import { TasksResponse } from '../models/response/TasksResponse';
import { ITask } from '../models/interfaces/ITask';
import { DeleteResponse } from '../models/response/DeleteResponse';
import { TaskStatisticsResponse } from '../models/response/TaskStatisticsResponse';

export default class TaskService {
  static async fetchTasks(): Promise<AxiosResponse<TasksResponse>> {
    return axiosInstance.get<TasksResponse>('/tasks/');
  }

  static async fetchTaskByID(taskID: string): Promise<AxiosResponse<TaskResponse>> {
    return axiosInstance.get<TaskResponse>(`/tasks/${taskID}`);
  }

  static async create(taskData: ITask): Promise<AxiosResponse<TaskResponse>> {
    return axiosInstance.postForm<TaskResponse>(`/tasks/`, { ...taskData });
  }

  static async update(taskID: string, taskData: ITask): Promise<AxiosResponse<TaskResponse>> {
    return axiosInstance.patchForm<TaskResponse>(`/tasks/${taskID}`, { ...taskData });
  }

  static async delete(taskID: string): Promise<AxiosResponse<DeleteResponse>> {
    return axiosInstance.delete<TaskResponse>(`/tasks/${taskID}`);
  }

  static async getStatistics(): Promise<AxiosResponse<TaskStatisticsResponse>> {
    return await axiosInstance.get<TaskStatisticsResponse>('/tasks/statistics');
  }
}

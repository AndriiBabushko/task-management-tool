import { makeAutoObservable } from 'mobx';
import { ITask } from '../models/interfaces/ITask';
import RootStore from './rootStore';
import TaskService from '../services/TaskService';
import { PopulatedITask } from '../models/interfaces/PopulatedITask';
import { TaskStatisticsResponse } from '../models/response/TaskStatisticsResponse';

export default class TaskStore {
  tasks: PopulatedITask[] = [];
  task = {} as PopulatedITask;
  rootStore: RootStore;
  statistics = {} as TaskStatisticsResponse;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setTask(task: PopulatedITask) {
    this.task = task;
  }

  setTasks(tasks: PopulatedITask[]) {
    this.tasks = tasks;
  }

  setStatistics(statistics: TaskStatisticsResponse) {
    this.statistics = statistics;
  }

  async getTasks() {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      const response = await TaskService.fetchTasks();
      this.setTasks(response.data.tasks);
      return response;
    } catch (error) {
      throw error;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }

  async getTaskByID(taskID: string) {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      const response = await TaskService.fetchTaskByID(taskID);
      this.setTask(response.data.task);
      return response;
    } catch (error) {
      throw error;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }

  async createTask(taskData: ITask) {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      return await TaskService.create(taskData);
    } catch (error) {
      throw error;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }

  async updateTask(taskID: string, taskData: ITask) {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      return await TaskService.update(taskID, taskData);
    } catch (error) {
      throw error;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }

  async deleteTask(taskID: string) {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      return await TaskService.delete(taskID);
    } catch (error) {
      throw error;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }

  async getStatistics() {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      const response = await TaskService.getStatistics();
      this.setStatistics(response.data);
      return response;
    } catch (error) {
      throw error;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }
}

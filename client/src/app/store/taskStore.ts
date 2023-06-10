import { makeAutoObservable } from 'mobx';
import { ITask } from '../models/interfaces/ITask';
import RootStore from './rootStore';
import TaskService from '../services/TaskService';

export default class TaskStore {
  tasks: ITask[] = [];
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setTasks(tasks: ITask[]) {
    this.tasks = tasks;
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
      return await TaskService.fetchTaskByID(taskID);
    } catch (error) {
      throw error;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }
}

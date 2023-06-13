import RootStore from './rootStore';
import { makeAutoObservable } from 'mobx';
import TaskService from '../services/TaskService';
import { ITag } from '../models/interfaces/ITag';
import TagService from '../services/TagService';

export default class TagStore {
  tags: ITag[] = [];
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setTags(tags: ITag[]) {
    this.tags = tags;
  }

  async getTags() {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      const response = await TagService.fetchTags();
      this.setTags(response.data.tags);
      return response;
    } catch (error) {
      throw error;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }
}

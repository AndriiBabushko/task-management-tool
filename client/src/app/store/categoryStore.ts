import RootStore from './rootStore';
import { makeAutoObservable } from 'mobx';
import { ICategory } from '../models/interfaces/ICategory';
import CategoryService from '../services/CategoryService';

export default class CategoryStore {
  categories: ICategory[] = [];
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setCategories(categories: ICategory[]) {
    this.categories = categories;
  }

  async getCategories() {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      const response = await CategoryService.fetchCategories();
      this.setCategories(response.data.categories);
      return response;
    } catch (error) {
      throw error;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }
}

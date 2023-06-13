import UserStore from './userStore';
import UIActionsStore from './uiActionsStore';
import TaskStore from './taskStore';
import TagStore from './tagStore';
import CategoryStore from './categoryStore';

export default class RootStore {
  userStore: UserStore;
  taskStore: TaskStore;
  tagStore: TagStore;
  categoryStore: CategoryStore;
  uiActionsStore: UIActionsStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.taskStore = new TaskStore(this);
    this.tagStore = new TagStore(this);
    this.categoryStore = new CategoryStore(this);
    this.uiActionsStore = new UIActionsStore();
  }
}

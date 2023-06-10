import UserStore from './userStore';
import UIActionsStore from './uiActionsStore';
import TaskStore from './taskStore';

export default class RootStore {
  userStore: UserStore;
  uiActionsStore: UIActionsStore;
  taskStore: TaskStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.taskStore = new TaskStore(this);
    this.uiActionsStore = new UIActionsStore();
  }
}

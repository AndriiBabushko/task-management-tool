import UserStore from './userStore';
import UIActionsStore from './uiActionsStore';

export default class RootStore {
  userStore: UserStore;
  uiActionsStore: UIActionsStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.uiActionsStore = new UIActionsStore();
  }
}

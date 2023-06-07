import { makeAutoObservable } from 'mobx';

interface INotification {
  title?: string;
  message?: string;
  status?: 'error' | 'warning' | 'success';
  isOpen: boolean;
}

export default class UIActionsStore {
  notification: INotification = { isOpen: false };
  isLogoutModalOpen = true;
  isPageLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setNotification(notification: INotification) {
    this.notification = notification;
  }

  setIsLogoutModalOpen(bool: boolean) {
    this.isLogoutModalOpen = bool;
  }

  setIsPageLoading(bool: boolean) {
    this.isPageLoading = bool;
  }
}

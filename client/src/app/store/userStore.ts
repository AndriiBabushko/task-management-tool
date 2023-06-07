import { makeAutoObservable } from 'mobx';

import AuthService from '../services/AuthService';
import { IUser } from '../models/IUser';
import RootStore from './rootStore';

export default class UserStore {
  user = {} as IUser;
  isAuth = false;
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  async login({ email, password }: IUser) {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      const response = await AuthService.login(email, password);
      console.log(response);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }

  async signup(userData: IUser) {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      const response = await AuthService.signup(userData);
      console.log(response);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }

  async logout() {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      const response = await AuthService.logout();
      console.log(response);
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({} as IUser);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }

  async checkAuth() {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      const response = await AuthService.checkAuth();
      console.log(response);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }
}

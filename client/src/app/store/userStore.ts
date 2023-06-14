import { makeAutoObservable } from 'mobx';

import AuthService from '../services/AuthService';
import RootStore from './rootStore';
import UserService from '../services/UserService';
import { PopulatedIUser } from '../models/interfaces/PopulatedIUser';
import { AxiosResponse } from 'axios';
import { UserStatisticsResponse } from '../models/response/UserStatisticsResponse';

export default class UserStore {
  user = {} as PopulatedIUser;
  isAuth = false;
  rootStore: RootStore;
  isAdmin = false;
  statistics = {} as UserStatisticsResponse;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setIsAdmin(bool: boolean) {
    this.isAdmin = bool;
  }

  setUser(user: PopulatedIUser) {
    this.user = user;
  }

  setStatistics(statistics: UserStatisticsResponse) {
    this.statistics = statistics;
  }

  async login({ email, password }: PopulatedIUser) {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);

      this.checkRoles(response);

      return response;
    } catch (error) {
      throw error;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }

  async signup(userData: PopulatedIUser) {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      const response = await AuthService.signup(userData);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);

      this.checkRoles(response);

      return response;
    } catch (error) {
      throw error;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }

  async logout() {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      const response = await AuthService.logout();
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setIsAdmin(false);
      this.setUser({} as PopulatedIUser);
      return response;
    } catch (error) {
      throw error;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }

  async checkAuth() {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      const response = await AuthService.checkAuth();
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);

      this.checkRoles(response);

      return response;
    } catch (error) {
      throw error;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }

  async deleteUser(userID: string) {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      const response = await UserService.deleteUser(userID);
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({} as PopulatedIUser);
      return response;
    } catch (error) {
      throw error;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }

  async resendActivationMail() {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      return await UserService.resendActivationMail();
    } catch (error) {
      throw error;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }

  async getStatistics() {
    this.rootStore.uiActionsStore.setIsPageLoading(true);
    try {
      const response = await UserService.getStatistics();
      this.setStatistics(response.data);
      return response;
    } catch (error) {
      throw error;
    } finally {
      this.rootStore.uiActionsStore.setIsPageLoading(false);
    }
  }

  private checkRoles(response: AxiosResponse) {
    const roles = [...response.data.user.roles];

    roles.map((r) => {
      if (r.name == 'admin') {
        this.setIsAdmin(true);
        return true;
      }
    });
  }
}

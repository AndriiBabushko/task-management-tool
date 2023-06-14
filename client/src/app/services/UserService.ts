import { AxiosResponse } from 'axios';
import { axiosInstance } from '../utils/axios';
import { UserResponse } from '../models/response/UserResponse';
import { UsersResponse } from '../models/response/UsersResponse';
import { DeleteResponse } from '../models/response/DeleteResponse';
import { ResendMailResponse } from '../models/response/ResendMailResponse';
import { UserStatisticsResponse } from '../models/response/UserStatisticsResponse';

export default class UserService {
  static async fetchUsers(): Promise<AxiosResponse<UsersResponse>> {
    return await axiosInstance.get<UsersResponse>('/users/');
  }

  static async updateUser(userID: string): Promise<AxiosResponse<UserResponse>> {
    return await axiosInstance.patch<UserResponse>(`/users/${userID}`);
  }

  static async deleteUser(userID: string): Promise<AxiosResponse<DeleteResponse>> {
    return await axiosInstance.delete<DeleteResponse>(`/users/${userID}`);
  }

  static async resendActivationMail(): Promise<AxiosResponse<ResendMailResponse>> {
    return await axiosInstance.get<ResendMailResponse>('/users/resendMail');
  }

  static async getStatistics(): Promise<AxiosResponse<UserStatisticsResponse>> {
    return await axiosInstance.get<UserStatisticsResponse>('/users/statistics');
  }
}

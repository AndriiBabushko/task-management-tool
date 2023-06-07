import { AxiosResponse } from 'axios';
import { axiosInstance } from '../utils/axios';
import { UserResponse } from '../models/response/UserResponse';

export default class UserService {
  static async fetchUsers(): Promise<AxiosResponse<UserResponse>> {
    return axiosInstance.get<UserResponse>('/api/users/');
  }
}

import { AxiosResponse } from 'axios';
import { axiosInstance } from '../utils/axios';
import { UserResponse } from '../models/response/UserResponse';
import { DeleteResponse } from '../models/response/DeleteResponse';

export default class UserService {
  static async fetchUsers(): Promise<AxiosResponse<UserResponse>> {
    return await axiosInstance.get<UserResponse>('/users/');
  }

  static async deleteUser(userID: string): Promise<AxiosResponse<DeleteResponse>> {
    return await axiosInstance.delete<DeleteResponse>(`/users/${userID}`);
  }
}

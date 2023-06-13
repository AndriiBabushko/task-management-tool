import axios, { AxiosResponse } from 'axios';
import { API_URL, axiosInstance } from '../utils/axios';
import { AuthResponse } from '../models/response/AuthResponse';
import { LogoutResponse } from '../models/response/LogoutResponse';
import { IUser } from '../models/interfaces/IUser';

export default class AuthService {
  static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return await axiosInstance.post<AuthResponse>('/users/login', { email, password });
  }

  static async signup(userData: IUser): Promise<AxiosResponse<AuthResponse>> {
    return await axiosInstance.post<AuthResponse>(
      '/users/signup',
      { ...userData },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  }

  static async logout(): Promise<AxiosResponse<LogoutResponse>> {
    return await axiosInstance.post(`/users/logout`);
  }

  static async checkAuth(): Promise<AxiosResponse<AuthResponse>> {
    return await axios.get<AuthResponse>(`${API_URL}/users/refresh`, { withCredentials: true });
    // return await axiosInstance.get<AuthResponse>(`users/refresh`);
  }
}

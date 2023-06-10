import { AxiosResponse } from 'axios';
import { axiosInstance } from '../utils/axios';
import { RolesResponse } from '../models/response/RolesResponse';
import { RoleResponse } from '../models/response/RoleResponse';

export default class RoleService {
  static async getRoles(): Promise<AxiosResponse<RolesResponse>> {
    return axiosInstance.get<RolesResponse>(`/roles/`);
  }

  static async getRoleByID(roleID: string): Promise<AxiosResponse<RoleResponse>> {
    return axiosInstance.get<RoleResponse>(`/roles/${roleID}`);
  }
}

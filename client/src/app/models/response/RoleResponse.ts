import { IRole } from '../interfaces/IRole';

export interface RoleResponse {
  role: IRole;
  success: boolean;
  message: string;
}

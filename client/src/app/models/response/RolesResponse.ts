import { IRole } from '../interfaces/IRole';

export interface RolesResponse {
  roles: IRole[];
  success: boolean;
  message: string;
}

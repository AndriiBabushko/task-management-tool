import { IUser } from '../interfaces/IUser';

export interface UsersResponse {
  success: boolean;
  users: IUser[];
}

import { IUser } from '../IUser';

export interface UserResponse {
  success: boolean;
  users: IUser[];
}

import { IUser } from '../IUser';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
  message: string;
  success: boolean;
  errors: [];
}

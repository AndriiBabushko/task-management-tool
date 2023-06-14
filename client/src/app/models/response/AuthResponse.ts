import { PopulatedIUser } from '../interfaces/PopulatedIUser';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: PopulatedIUser;
  message: string;
  success: boolean;
  errors: [];
}

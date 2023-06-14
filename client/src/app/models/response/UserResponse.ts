import { PopulatedIUser } from '../interfaces/PopulatedIUser';

export interface UserResponse {
  success: boolean;
  user: PopulatedIUser;
}

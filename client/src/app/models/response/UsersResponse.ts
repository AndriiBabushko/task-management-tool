import { PopulatedIUser } from '../interfaces/PopulatedIUser';

export interface UsersResponse {
  success: boolean;
  users: PopulatedIUser[];
}

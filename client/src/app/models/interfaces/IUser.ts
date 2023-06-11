import { IRole } from './IRole';
import { IGroup } from './IGroup';

export interface IUser {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  image: string;
  tasks: string[];
  roles: IRole[];
  groups: IGroup[];
  isActivated: boolean;
}

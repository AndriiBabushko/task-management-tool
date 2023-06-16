import { IRole } from './IRole';
import { IGroup } from './IGroup';

export interface PopulatedIUser {
  _id: string;
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

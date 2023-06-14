import { IGroup } from './IGroup.js';
import { IRole } from './IRole.js';
import { ITask } from './ITask.js';
import { Types } from 'mongoose';

export interface IUserPopulated {
  id: Types.ObjectId;
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  image: string;
  tasks: ITask[];
  roles: IRole[];
  groups: IGroup[];
  isActivated: boolean;
  activationLink: string;
}

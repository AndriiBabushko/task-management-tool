export interface IUser {
  _id: string;
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  image: string;
  tasks: string[];
  roles: string[];
  groups: string[];
  isActivated: boolean;
}

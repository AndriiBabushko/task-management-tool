export interface IUser {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  image: string;
  tasks: [];
  roles: [];
  groups: [];
  isActivated: boolean;
}

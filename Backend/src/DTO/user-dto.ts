export default class UserDto {
  id;
  name;
  surname;
  username;
  email;
  password;
  image;
  tasks;
  roles;
  groups;
  isActivated;

  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.surname = model.surname;
    this.username = model.username;
    this.email = model.email;
    this.password = model.password;
    this.image = model.image;
    this.tasks = model.tasks;
    this.roles = model.roles;
    this.groups = model.groups;
    this.isActivated = model.isActivated;
  }
}

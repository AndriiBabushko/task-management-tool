export default class GroupDto {
  id: string;
  name: string;
  description: string;
  image: string;
  users: string[];
  creator: string;
  access: string;

  constructor(model) {
    this.id = model.id;
    this.name = model.name;
    this.description = model.description;
    this.image = model.image;
    this.users = model.users;
    this.creator = model.creator;
    this.access = model.access;
  }
}

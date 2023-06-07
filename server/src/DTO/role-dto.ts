export default class RoleDto {
  id: string;
  name: string;
  description: string;

  constructor(model) {
    this.id = model.id;
    this.name = model.name;
    this.description = model.description;
  }
}

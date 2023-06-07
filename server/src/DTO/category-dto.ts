export default class CategoryDto {
  id: string;
  name: string;
  description: string;

  constructor(model) {
    this.id = model.id;
    this.name = model.name;
    this.description = model.description;
  }
}

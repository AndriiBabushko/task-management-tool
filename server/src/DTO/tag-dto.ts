export default class TagDto {
  id: string;
  name: string;
  description: string;

  constructor(model) {
    this.id = model.id;
    this.name = model.name;
    this.description = model.description;
  }
}

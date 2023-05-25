export default class TaskDto {
  id;
  title;
  description;
  creationDate;
  deadlineDate;
  creator;
  tags;
  category;
  access;

  constructor(model) {
    this.id = model.id;
    this.title = model.title;
    this.description = model.description;
    this.creationDate = model.creationDate;
    this.deadlineDate = model.deadlineDate;
    this.creator = model.creator;
    this.tags = model.tags;
    this.category = model.category;
    this.access = model.access;
  }
}
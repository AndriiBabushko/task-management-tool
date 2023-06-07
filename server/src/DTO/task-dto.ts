export default class TaskDto {
  id: string;
  title: string;
  description: string;
  creationDate: Date;
  deadlineDate: Date;
  creator: string;
  tags: string[];
  categories: string[];
  access: string;
  isCompleted: boolean;

  constructor(model) {
    this.id = model.id;
    this.title = model.title;
    this.description = model.description;
    this.creationDate = model.creationDate;
    this.deadlineDate = model.deadlineDate;
    this.creator = model.creator;
    this.tags = model.tags;
    this.categories = model.categories;
    this.access = model.access;
    this.isCompleted = model.isCompleted;
  }
}

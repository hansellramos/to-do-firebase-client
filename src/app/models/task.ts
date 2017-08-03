export class Task {

  public id: string;
  public name: string;
  public priority: number;
  public dueDate: Date;

  constructor (id: string, name?: string, priority?: number, dueDate?: Date) {
    this.id = id;
    this.name = name;
    this.priority = priority;
    this.dueDate = dueDate;
  }

}

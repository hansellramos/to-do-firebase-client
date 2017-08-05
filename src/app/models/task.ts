export class Task {

  public id: string;
  public owner: string;
  public name: string;
  public priority: number;
  public dueDate: Date;

  constructor (
      id: string = ''
    , owner: string = ''
    , name: string = ''
    , priority: number = 1
    , dueDate: Date = null
  ) {
    this.id = id;
    this.owner = owner;
    this.name = name;
    this.priority = priority;
    this.dueDate = dueDate;
  }

}

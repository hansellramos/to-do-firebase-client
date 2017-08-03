export class Task {

  public owner: string;
  public name: string;
  public priority: number;
  public dueDate: Date;
  public key: string;

  constructor (
      owner: string
    , name: string = ''
    , priority: number = 1
    , dueDate: Date = null
    , key: string = ''
  ) {
    this.owner = owner;
    this.name = name;
    this.priority = priority;
    this.dueDate = dueDate;
    this.key = key;
  }

}

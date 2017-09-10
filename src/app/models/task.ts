export class Task {

  public id: string;
  public owner: string;
  public name: string;
  public priority: number;
  public completed: boolean;
  public dueDate: string;
  public checklist: string;
  public created: number;
  public modified: number;

  constructor (
      id: string = ''
    , owner: string = ''
    , name: string = ''
    , priority: number = 1
    , completed: boolean = false
    , dueDate: string = null
    , checklist: string = null
    , created: number = null
    , modified: number = null
  ) {
    this.id = id;
    this.owner = owner;
    this.name = name;
    this.priority = priority;
    this.completed = completed;
    this.dueDate = dueDate;
    this.checklist = checklist;
    this.created = created;
    this.modified = modified;
  }

}

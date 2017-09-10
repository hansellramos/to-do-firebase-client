import {Task} from './task';

export class Checklist {

  public id: string;
  public owner: string;
  public name: string;
  public tasks: Array<Task>;
  public created: number;
  public modified: number;

  constructor(
    id: string
    , owner: string
    , name: string
    , tasks?: Array<Task>
    , created?: number
    , modified?: number
  ) {
    this.id = id;
    this.owner = owner;
    this.name = name;
    this.tasks = tasks ? tasks : [];
    this.created = created;
    this.modified = modified;
  }
}

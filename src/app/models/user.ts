import {Task} from 'app/models/task';

export class User {

  public id: string;
  public email: string;
  public tasks: Array<Task>;

  constructor(
      id: string = ''
    , email: string = ''
    , tasks?: Array<Task>) {
    this.id = id;
    this.email = email;
    this.tasks = tasks ? tasks : [];
  }
}

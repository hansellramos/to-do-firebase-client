import {Checklist} from './checklist';

export class User {

  public id: string;
  public email: string;
  public checklists: Array<Checklist>;
  public created: number;
  public modified: number;

  constructor(
      id: string = ''
    , email?: string
    , checklists?: Array<Checklist>
    , created?: number
    , modified?: number
  ) {
    this.id = id;
    this.email = email;
    this.checklists = checklists ? checklists : [];
    this.created = created;
    this.modified = modified;
  }
}

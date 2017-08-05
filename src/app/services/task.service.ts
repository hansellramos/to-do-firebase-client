import { Injectable } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Task} from '../models/task';
import * as firebase from 'firebase/app';

@Injectable()
export class TaskService {

  private ref: string;

  constructor(private db: AngularFireDatabase) {
    this.ref = '/tasks';
  }

  public all(): FirebaseListObservable<Task[]> {
    return this.db.list(this.ref);
  }

  public one(uid: string): FirebaseObjectObservable<Task> {
    return this.db.object(this.ref + '/' + uid);
  }

  public create(item: Task): firebase.Promise<void> {
    return this.db.list(this.ref).push(item);
  }

  public update(item: Task): firebase.Promise<void> {
    return this.db.object(this.ref + '/' + item.id).update(item);
  }

  public delete(item: Task): firebase.Promise<void> {
    return this.db.object(this.ref + '/' + item.id).remove();
  }

}

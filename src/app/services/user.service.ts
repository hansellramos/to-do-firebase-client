import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { User } from '../models/user';

@Injectable()
export class UserService {

  private ref: string;

  constructor(private db: AngularFireDatabase) {
    this.ref = '/users';
  }

  public all(): FirebaseListObservable<User[]> {
    return this.db.list(this.ref);
  }

  public one(uid: string): FirebaseObjectObservable<User> {
    return this.db.object(this.ref + '/' + uid);
  }

  public create(item: User): firebase.Promise<void> {
    return this.db.list(this.ref).push(item);
  }

  public update(uid: string, item: object): firebase.Promise<void> {
    return this.db.object(this.ref + '/' + uid).update(item);
  }

}

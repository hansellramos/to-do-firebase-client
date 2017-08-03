import { Injectable } from '@angular/core';

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

}

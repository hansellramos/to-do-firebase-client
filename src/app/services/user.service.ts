import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { User } from '../models/user';

/**
 * This class is used to access to remote server users data
 */
@Injectable()
export class UserService {

  /**
   * Internal data path in server
   */
  private ref: string;

  /**
   *
   * @param db AngularFireDatabase injection
   */
  constructor(private db: AngularFireDatabase) {
    this.ref = '/users';
  }

  /**
   * This method is used to get all users from remote server
   * @returns {FirebaseListObservable<User[]>} A promise with all users from remote server
   */
  public all(): FirebaseListObservable<User[]> {
    return this.db.list(this.ref);
  }

  /**
   * This method is used to get one User from remote server
   * @param uid User uid to get
   * @returns {FirebaseObjectObservable<any>} A promise with server response data
   */
  public one(uid: string): FirebaseObjectObservable<User> {
    return this.db.object(this.ref + '/' + uid);
  }

  /**
   * This method is used to create a new user in remote server
   * @param item User data
   * @returns {firebase.Promise<void>} A promise with server response data
   */
  public create(item: User): firebase.Promise<void> {
    return this.db.list(this.ref).push(item);
  }

  /**
   * This method is used to update an user in remote server
   * @param uid User uid
   * @param item Object with fields to update
   * @returns {firebase.Promise<void>} A promise with server response data
   */
  public update(uid: string, item: object): firebase.Promise<void> {
    return this.db.object(this.ref + '/' + uid).update(item);
  }

}

import { Injectable } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Task} from '../models/task';
import * as firebase from 'firebase/app';

/**
 * This class is used to access to remote server task data
 */
@Injectable()
export class TaskService {

  /**
   * Internal data path in server
   */
  private ref: string;

  /**
   *
   * @param db AngularFireDatabase injection
   */
  constructor(private db: AngularFireDatabase) {
    this.ref = '/tasks';
  }

  /**
   * This method is used to get all tasks from remote server
   * @returns {FirebaseListObservable<User[]>} A promise with all tasks from remote server
   */
  public all(): FirebaseListObservable<Task[]> {
    return this.db.list(this.ref);
  }

  /**
   * This method is used to get one Task from remote server
   * @param uid Task uid to get
   * @returns {FirebaseObjectObservable<Task>} A promise with server response data
   */
  public one(uid: string): FirebaseObjectObservable<Task> {
    return this.db.object(this.ref + '/' + uid);
  }

  /**
   * This method is used to create a new task in remote server
   * @param item Task data
   * @returns {firebase.Promise<void>} A promise with server response data
   */
  public create(item: Task): firebase.Promise<void> {
    return this.db.list(this.ref).push(item);
  }

  /**
   * This method is used to update a task in remote server
   * @param item Object with fields to update
   * @returns {firebase.Promise<void>} A promise with server response data
   */
  public update(item: Task): firebase.Promise<void> {
    return this.db.object(this.ref + '/' + item.id).update(item);
  }

  /**
   * This method is used to delete a task in remote server
   * @param item Object to delete
   * @returns {firebase.Promise<void>} A promise with server response data
   */
  public delete(item: Task): firebase.Promise<void> {
    return this.db.object(this.ref + '/' + item.id).remove();
  }

}

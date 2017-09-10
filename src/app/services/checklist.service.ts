import { Injectable } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Checklist} from '../models/checklist';
import * as firebase from 'firebase/app';

/**
 * This class is used to access to remote server checklist data
 */
@Injectable()
export class ChecklistService {

  /**
   * Internal data path in server
   */
  private ref: string;

  /**
   *
   * @param db AngularFireDatabase injection
   */
  constructor(private db: AngularFireDatabase) {
    this.ref = '/checklists';
  }

  /**
   * This method is used to get all checklists from remote server
   * @returns {FirebaseListObservable<User[]>} A promise with all checklists from remote server
   */
  public all(): FirebaseListObservable<Checklist[]> {
    return this.db.list(this.ref);
  }

  /**
   * This method is used to get one Checklist from remote server
   * @param uid Checklist uid to get
   * @returns {FirebaseObjectObservable<Checklist>} A promise with server response data
   */
  public one(uid: string): FirebaseObjectObservable<Checklist> {
    return this.db.object(this.ref + '/' + uid);
  }

  /**
   * This method is used to create a new Checklist in remote server
   * @param item Checklist data
   * @returns {firebase.Promise<void>} A promise with server response data
   */
  public create(item: Checklist): firebase.Promise<void> {
    return this.db.list(this.ref).push(item);
  }

  /**
   * This method is used to update a Checklist in remote server
   * @param item Object with fields to update
   * @returns {firebase.Promise<void>} A promise with server response data
   */
  public update(item: Checklist): firebase.Promise<void> {
    return this.db.object(this.ref + '/' + item.id).update(item);
  }

  /**
   * This method is used to delete a Checklist in remote server
   * @param item Object to delete
   * @returns {firebase.Promise<void>} A promise with server response data
   */
  public delete(item: Checklist): firebase.Promise<void> {
    return this.db.object(this.ref + '/' + item.id).remove();
  }

}

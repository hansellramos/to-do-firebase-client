import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';

import { AngularFireAuth } from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';

import {Router} from '@angular/router';
import {User} from '../models/user';
import {UserService} from './user.service';

/**
 * This class is used to access to auth services from remote server
 */
@Injectable()
export class AuthService {

  /**
   * User that need to use auth services
   */
  private _user: firebase.User;
  get user(): firebase.User { return this._user; }
  set user(value: firebase.User) { this._user = value; }

  /**
   * This get returns true if user is authenticated, otherwise false
   * @returns {boolean}
   */
  get authenticated(): boolean { return this._user !== null; }

  /**
   * This get returns authenticated user uid
   * @returns {string}
   */
  get id(): string { return this.authenticated ? this.user.uid : ''; }

  /**
   *
   * @param auth AngularFireAuth service
   * @param db AngularFireDatabase service
   * @param userService UserService
   * @param router Router access
   */
  constructor(
      public auth: AngularFireAuth
    , private db: AngularFireDatabase
    , private userService: UserService
    , private router: Router
  ) {
    this.auth.authState.subscribe(user => this.user = user);
  }

  /**
   * This method is used to sign uout in the application
   * @returns {firebase.Promise<any>}
   */
  public signOut(): firebase.Promise<any> {
    return this.auth.auth.signOut();
  }

  /**
   * This method is used to sign up the aplication using email and password
   * @param user User to authenticate
   * @param password Password to authenticate
   * @returns {firebase.Thenable<any>} Returns a primise with remote server data
   */
  public signUpWithEmailAndPassword(user: User, password: string): firebase.Promise<any> {
    return this.auth.auth.createUserWithEmailAndPassword(user.email, password)
      .then(response => {
        this.userService.one(response.uid).take(1).toPromise()
          .then((remoteUser) => {
            if (!remoteUser.$exists()) {
              this.userService.update(response.uid, user)
                .then(() => { this.router.navigate(['/signin']); })
                .catch(err => console.log('ERRROR @ AuthService#signUp()#createNewUser :', err));
            }
          });
      })
      .catch(err => console.log('ERRROR @ AuthService#signUp() :', err))
  }

  /**
   * This method is used to sign in the aplication using google credentials
   * @returns {firebase.Thenable<any>} Returns a primise with remote server data
   */
  public signInWithGoogle(): firebase.Promise<any> {
    return this.auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(response => {
        this.router.navigate(['/home']);
        this.db.object(`/users/${response.user.uid}`)
          .subscribe(user => {
            if (!user.$exists()) {
              const {email, id} = response.user;
              this.db.object(`/users/${response.user.uid}`).set({
                email
                , id
              })
            }
          });
      })
      .catch(err => console.log('ERRROR @ AuthService#signInWithGoogle() :', err));
  }

  /**
   * This method is used to sign in the aplication using email and password
   * @param user User to authenticate
   * @param password Password to authenticate
   * @returns {firebase.Thenable<any>} Returns a primise with remote server data
   */
  public signInWithEmailAndPassword(email: string, password: string): firebase.Promise<void> {
    return this.auth.auth.signInWithEmailAndPassword(email, password);
  }

  /**
   * This method is used to send a email with password reset link
   * @param user User to recover password
   * @returns {firebase.Thenable<any>} Returns a primise with remote server data
   */
  public sendPasswordResetEmail(user: User): firebase.Promise<void> {
    return this.auth.auth.sendPasswordResetEmail(user.email);
  }

  /**
   * This method is used to verify sent reset password code
   * @param code Code to verify
   * @returns {firebase.Thenable<any>} Returns a primise with remote server data
   */
  public verifyPasswordResetCode(code: string): firebase.Promise<void> {
    return this.auth.auth.verifyPasswordResetCode(code);
  }

  /**
   * This method returns if user is authenticated
   * @returns {boolean}
   */
  public isAuth() {
    return this.auth.auth.currentUser !== null;
  }

  /**
   * Returns current user
   * @returns {firebase.User|null}
   */
  public getCurrentUser() {
    return this.auth.auth.currentUser;
  }

}

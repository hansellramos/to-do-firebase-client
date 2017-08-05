import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';

import { AngularFireAuth } from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';

import {Router} from '@angular/router';
import {User} from '../models/user';
import {UserService} from './user.service';

@Injectable()
export class AuthService {

  private _user: firebase.User;
  get user(): firebase.User { return this._user; }
  set user(value: firebase.User) { this._user = value; }

  get authenticated(): boolean { return this._user !== null; }

  get id(): string { return this.authenticated ? this.user.uid : ''; }

  constructor(
      public auth: AngularFireAuth
    , private db: AngularFireDatabase
    , private userService: UserService
    , private router: Router
  ) {
    this.auth.authState.subscribe(user => this.user = user);
  }

  public signOut(): firebase.Promise<any> {
    return this.auth.auth.signOut();
  }

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

  public signInWithEmailAndPassword(email: string, password: string): firebase.Promise<void> {
    return this.auth.auth.signInWithEmailAndPassword(email, password);
  }

  public sendPasswordResetEmail(user: User): firebase.Promise<void> {
    return this.auth.auth.sendPasswordResetEmail(user.email);
  }

  public verifyPasswordResetCode(code: string): firebase.Promise<void> {
    return this.auth.auth.verifyPasswordResetCode(code);
  }

  public isAuth() {
    return this.auth.auth.currentUser !== null;
  }

  public getCurrentUser() {
    return this.auth.auth.currentUser;
  }

}

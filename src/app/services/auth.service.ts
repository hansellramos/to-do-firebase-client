import { Injectable } from '@angular/core';

import {Promise, reject, resolve} from 'q';

import * as firebase from 'firebase/app';

import { AngularFireAuth } from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {

  private _user: firebase.User;
  get user(): firebase.User { return this._user; }
  set user(value: firebase.User) { this._user = value; }

  get authenticated(): boolean { return this._user !== null; }

  get id(): string { return this.authenticated ? this.user.uid : ''; }

  constructor(
      public afAuth: AngularFireAuth
    , private db: AngularFireDatabase
    , private router: Router
  ) {
    this.afAuth.authState.subscribe(user => this.user = user);
  }

  public logout(): firebase.Promise<any> {
    return this.afAuth.auth.signOut();
  }

  public loginWithGoogle(): firebase.Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(response => {
        this.router.navigate(['/home']);
        this.db.object(`/users/${response.user.uid}`)
          .subscribe(user => {
            if (!user.$exists()) {
              const {email, uid} = response.user;
              this.db.object(`/users/${response.user.uid}`).set({
                email
                , uid
              })
            }
          });
      })
      .catch(err => console.log('ERRROR @ AuthService#signIn() :', err));
  }

  public loginWithEmailAndPassword(email: string, password: string) {
    return Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(userData => resolve(userData),
          err => reject(err));
    });
  }

  public isAuth() {
    return this.afAuth.auth.currentUser !== null;
  }

  public getCurrentUser() {
    return this.afAuth.auth.currentUser;
  }

}

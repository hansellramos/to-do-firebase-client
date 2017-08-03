import {Component, Output, EventEmitter} from '@angular/core';

import { Login } from '../../models/login';

import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
      private authService: AuthService
    , private router: Router
  ) { }

  public loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  show() {
    console.log(this.authService.getCurrentUser());
  }

}

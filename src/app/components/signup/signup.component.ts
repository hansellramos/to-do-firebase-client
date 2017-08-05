import { Component } from '@angular/core';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent {

  user: User;
  password: string;
  confirmPassword: string;

  constructor(
      private authService: AuthService
    , private router: Router
  ) {
    this.user = new User();
    this.password = '';
    this.confirmPassword = '';
  }

  public signUpWithGoogle(): void {
    this.authService.signInWithGoogle();
  }

  signUp() {
    this.authService.signUpWithEmailAndPassword(this.user, this.password)
      .then(() => {
        this.router.navigate(['/home']);
      });
  }

}

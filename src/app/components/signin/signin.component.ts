import {Component} from '@angular/core';

import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import {User} from '../../models/user';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SignInComponent {

  user: User;
  password: string;

  constructor(
      private authService: AuthService
    , private router: Router
  ) {
    this.user = new User();
    this.password = '';
  }

  public signInWithGoogle(): void {
    this.authService.signInWithGoogle();
  }

  public signInWithEmailAndPassword() {
    this.authService.signInWithEmailAndPassword(this.user.email, this.password)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(error => {
        if (error.message) {
          alert(error.message);
        } else {
          alert('Invalid email or password');
        }
      })
  }

}

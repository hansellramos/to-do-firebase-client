import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  user: User;
  waitingCode: boolean;
  verificationCode: string;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.user = new User();
    this.waitingCode = false;
    this.verificationCode = '';
  }

  public signInWithGoogle(): void {
    this.authService.signInWithGoogle();
  }

  public sendPasswordResetEmail() {
    this.authService.sendPasswordResetEmail(this.user)
      .then(result => {
        debugger;
        this.waitingCode = true;
      })
      .catch(error => {
        console.log(error);
      });
  }

  public verifyPasswordResetCode() {
    this.authService.verifyPasswordResetCode(this.verificationCode)
      .then(result => {
        debugger;
      })
      .catch(error => {
        console.log(error);
      });
  }

}

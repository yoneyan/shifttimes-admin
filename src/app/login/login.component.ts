import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from '../service/auth.service';
import {CommonService} from '../service/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private commonService: CommonService,
  ) {
  }

  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl();

  ngOnInit(): void {
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  loginMail() {
    console.log(this.email.value);
    console.log(this.password.value);
    this.authService.loginWithMail(this.email.value, this.password.value);
  }

  loginGoogle() {
    this.authService.loginWithGoogle();
  }

  loginTwitter() {
    this.commonService.openBar('現在この認証方法は使用できません。', 2000);
    // this.authService.loginWithTwitter();
  }
}

import {Component, OnInit} from '@angular/core';
import {UserService} from '../../service/user.service';
import {FormControl, Validators} from '@angular/forms';
import {CommonService} from '../../service/common.service';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent implements OnInit {

  constructor(
    private userService: UserService,
    private commonService: CommonService,
  ) {
  }

  hide = false;
  id = new FormControl();
  name = new FormControl('', [Validators.required, Validators.email]);
  email = new FormControl();
  password = new FormControl();
  passwordVerify = new FormControl();


  ngOnInit(): void {
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  teacherCreate() {
    if (this.password !== this.passwordVerify) {
      this.commonService.openBar('パスワードが異なります。', 2000);
    }
    this.userService.createUser({
      d: {name: this.name.value, active: true, teacher: true, office: false, admin: false, id: this.id.value},
      email: this.email.value,
      pass: this.password.value,
    });
  }

  uidRegister(data) {
    // this.userService.registerUser(new DetailUserData(data.name, data.uid, data.userid, '0', '', '', false));
  }

}

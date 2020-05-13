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

  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl();
  id = new FormControl();
  aId = new FormControl();
  tId = new FormControl();
  oId = new FormControl();
  name = new FormControl();
  uid = new FormControl();
  stat = false;

  ngOnInit(): void {
    this.stat = this.commonService.getUserRegister().result;
    this.uid.setValue(this.commonService.getUserRegister().uid);
    this.userService.nextID().then(r => {
      this.aId.setValue(r.admin);
      this.tId.setValue(r.teacher);
      this.oId.setValue(r.office);
    });
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  userRegister() {
    this.userService.registerUser(this.email.value, this.password.value);
  }

  teacherCreate() {
    this.userService.createUser({
      d: {name: this.name.value, isActive: true, isTeacher: true, isOffice: false, isAdmin: false, id: this.tId.value},
      uid: this.uid.value,
    });
    this.commonService.pushUserRegister({result: false, uid: ''});
  }

  uidRegistration() {
    this.userService.createUser({
      d: {name: this.name.value, isActive: true, isTeacher: true, isOffice: true, isAdmin: true, id: this.id.value},
      uid: this.uid.value,
    });
  }
}

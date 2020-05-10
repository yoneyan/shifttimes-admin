import {Component, OnInit} from '@angular/core';
import {UserService} from '../../service/user.service';
import {FormControl} from '@angular/forms';
import {CommonService} from '../../service/common.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent implements OnInit {

  constructor(
    private userService: UserService,
    private commonService: CommonService,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private authService: AuthService
  ) {
  }

  id = new FormControl();
  name = new FormControl();
  uid = new FormControl();


  ngOnInit(): void {
  }

  teacherCreate() {
    this.userService.createUser({
      d: {name: this.name.value, isActive: true, isTeacher: true, isOffice: false, isAdmin: false, id: this.id.value},
      uid: this.uid.value,
    });
  }

  adminCreate() {
    this.userService.createUser({
      d: {name: this.name.value, isActive: true, isTeacher: true, isOffice: true, isAdmin: true, id: this.id.value},
      uid: this.uid.value,
    });
  }
}

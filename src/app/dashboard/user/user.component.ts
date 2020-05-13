import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router,
  ) {
  }

  public data: Data[] = new Array();
  public year: number;
  public month: number;

  ngOnInit(): void {
    this.getUser();
    const date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
  }

  detailShiftThisMonth(id): void {
    this.router.navigate(['/dashboard/shift/' + id + '/' + String(this.year) + '/' + String(this.month)]).then();
  }

  detailShiftNextMonth(id): void {
    let tmpYear = this.year;
    let tmpMonth: number = this.month + 1;
    if (tmpMonth > 12) {
      tmpYear += 1;
      tmpMonth = 1;
    }
    this.router.navigate(['/dashboard/shift/' + id + '/' + String(tmpYear) + '/' + String(tmpMonth)]).then();
  }

  getUser(): void {
    this.userService.getAllUser()
      .then((d) => {
        for (let i = 0; i < d.size; i++) {
          this.data.push({
            admin: d.docs[i].data().isAdmin,
            name: d.docs[i].data().name,
            active: d.docs[i].data().isActive,
            office: d.docs[i].data().isOffice,
            teacher: d.docs[i].data().isTeacher,
            uid: d.docs[i].id,
            id: d.docs[i].data().id
          });
        }
      });
  }

}

interface Data {
  id: string;
  uid: string;
  name: string;
  active: boolean;
  admin: boolean;
  teacher: boolean;
  office: boolean;
}

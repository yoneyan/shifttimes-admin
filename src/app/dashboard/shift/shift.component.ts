import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ShiftService} from '../../service/shift.service';
import {CommonService} from '../../service/common.service';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private shiftService: ShiftService,
    private router: Router,
    private commonService: CommonService,
    private userService: UserService,
  ) {
  }

  public id: string;
  public date: Date[] = [];
  public teacher: Teacher[][] = [];
  public office: Office[] = [];
  public plans: string[] = [];
  public comment: string[] = [];
  public month: number;
  public year: number;
  public user: any;
  public important: string;
  public log: string;
  private len: number;
  public loading = 100;


  ngOnInit(): void {
    this.loading = 0;
    this.id = this.route.snapshot.paramMap.get('id');
    this.year = +this.route.snapshot.paramMap.get('year');
    this.month = +this.route.snapshot.paramMap.get('month');
    this.userService.getAllUser()
      .then(d => {
        for (const data of d.docs) {
          if (data.data().id === this.id) {
            this.user = data.data();
          }
        }
      });
    this.loading = 20;
    this.calendar();
  }

  initData(): void {
    this.loading = 0;
    this.date.length = 0;
    this.teacher.length = 0;
    this.office.length = 0;
    this.plans.length = 0;
    this.comment.length = 0;
    this.important = '';
    this.loading = 20;
  }

  prevMonth(): void {
    if (this.loading !== 100) {
      this.commonService.openBar('只今、読み込み中なので、もう一度試してください。', 2000);
    } else {
      this.initData();
      this.month = this.month - 1;
      if (this.month < 1) {
        this.year = this.year - 1;
        this.month = 12;
      }
      this.router.navigate(['/admin/shift/' + this.id + '/' + String(this.year) + '/' + String(this.month)]).then();
      this.calendar();
    }
  }

  nextMonth(): void {
    if (this.loading !== 100) {
      this.commonService.openBar('只今、読み込み中なので、もう一度試してください。', 2000);
    } else {
      this.initData();
      this.month = this.month + 1;
      if (this.month > 12) {
        this.year = this.year + 1;
        this.month = 1;
      }
      this.router.navigate(['/admin/shift/' + this.id + '/' + String(this.year) + '/' + String(this.month)]).then();
      this.calendar();
    }
  }

  calendar(): void {
    const weeks = ['日', '月', '火', '水', '木', '金', '土'];
    const startDate = new Date(this.year, this.month - 1, 1);
    const endDayCount = new Date(this.year, this.month, 0).getDate();
    let day = startDate.getDay();

    for (let i = 1; i <= endDayCount; i++) {
      this.date.push({
        day: i,
        week: weeks[day],
        schedule: 'None',
      });
      if (day === 6) {
        day = 0;
      } else {
        day++;
      }
    }
    this.loading = 40;
    this.baseCalendar(endDayCount);
    this.shift(endDayCount);
  }

  baseCalendar(end: number): void {
    this.shiftService.getCalendar({year: this.year, month: this.month})
      .then((data) => {
        if (data === 0) {
          for (let i = 1; i <= end; i++) {
            this.date[i - 1].schedule = 'データなし';
          }
        } else {
          this.important = data.info;
          for (let i = 1; i <= end; i++) {
            let tmp: string;
            if (data[i] === 0) {
              tmp = '休校';
            } else if (data[i] === 1) {
              tmp = '自習室のみ';
            } else if (data[i] === 2) {
              tmp = '開校';
            } else {
              tmp = 'データなし';
            }
            this.date[i - 1].schedule = tmp;
          }
        }
      });
    this.loading += 20;
  }

  shift(end: number): void {
    this.shiftService.searchTimetables()
      .then((tables) => {
        this.len = Object.keys(tables).length;
        for (let i = 0; i < 4; i++) {
          this.plans.push(tables['time' + `${i + 1}`]);
        }
        // this.base_dataCalendar(end);
        this.base_dataCalendar(end);
      });
    this.loading += 20;
  }

  dataCalendar(end: number, teacher, office): void {
    this.shiftService.getShift({
      id: this.id,
      year: this.year,
      month: this.month
    })
      .then((data) => {
        for (let i = 0; i < this.len; i++) {
          for (let j = 1; j <= end; j++) {
            if (data[`${j}` + '-' + `${i + 1}`] === 2 && teacher[i][j - 1].plan !== 2) {
              // ○
              teacher[i][j - 1].display = teacher[i][j - 1].display + ' → ◯';
              teacher[i][j - 1].color = '#6a6aec';
              teacher[i][j - 1].plan = 2;
            } else if (data[`${j}` + '-' + `${i + 1}`] === 1 && teacher[i][j - 1].plan !== 1) {
              // △
              teacher[i][j - 1].display = teacher[i][j - 1].display + ' → △';
              teacher[i][j - 1].color = '#ffff00';
              teacher[i][j - 1].plan = 1;
            } else if (data[`${j}` + '-' + `${i + 1}`] === 0 && teacher[i][j - 1].plan !== 0) {
              // X
              teacher[i][j - 1].display = teacher[i][j - 1].display + ' → X';
              teacher[i][j - 1].color = '#c71585';
              teacher[i][j - 1].plan = 0;
            }

            if (i === 0) {
              // office
              if (data['o-' + `${i}`] === office[i].plan) {
                office[j]({
                  display: office[i].display + ' →  ' + data['o-' + `${i}`],
                  color: '#6a6aec',
                  plan: data['o-' + `${i}`]
                });
              }
              // comment
              this.comment.push(data[`${j}` + '-comment']);
            }
          }
        }
        console.log(teacher);
        console.log(office);
        this.teacher = teacher;
        this.office = office;
      });
    this.loading += 20;
  }

  base_dataCalendar(end: number): void {
    this.shiftService.getShiftBaseData({
      id: this.id,
      year: this.year,
      month: this.month
    })
      .then((data) => {
          console.log(data);
          const teacher: Teacher[][] = [];
          const office: Office[] = [];

          for (let i = 0; i < this.len; i++) {
            teacher[i] = [];
            for (let j = 1; j <= end; j++) {
              if (data['t-' + `${j}` + '-' + `${i + 1}`] === 2) {
                // ○
                teacher[i].push({display: '◯', color: '#CCCCFF', plan: 2});
              } else if (data['t-' + `${j}` + '-' + `${i + 1}`] === 1) {
                // △
                teacher[i].push({display: '△', color: '#FFFF99', plan: 1});
              } else {
                // X
                teacher[i].push({display: 'X', color: '#FF9999', plan: 0});
              }

              if (i === 0) {
                // office
                if (data['o-' + `${i}`] === null || data['o-' + `${i}`] === undefined || data['o-' + `${i}`] === 'None') {
                  office.push({display: '', color: '#ffffff', plan: 'None'});
                } else {
                  office.push({display: data['o-' + `${i}`], color: '#CCCCFF', plan: data['o-' + `${i}`]});
                }
              }
            }
          }
          console.log(teacher);
          console.log(office);
          this.dataCalendar(end, teacher, office);

        }
      )
      .catch(() => {
        console.log('data none');
        const teacher: Teacher[][] = [];
        const office: Office[] = [];

        for (let i = 0; i < this.len; i++) {
          teacher[i] = [];
          for (let j = 1; j <= end; j++) {
            teacher[i].push({display: 'X', color: '#FF9999', plan: 0});
            if (i === 0) {
              office.push({display: '', color: '#ffffff', plan: 'None'});
            }
          }
        }
        this.dataCalendar(end, teacher, office);
      });
  }

  apply(): void {
    const teacher: { date: string, data: number }[] = new Array();
    const office: { date: string, data: string }[] = new Array();

    for (let i = 0; i < this.date.length; i++) {
      for (let j = 0; j < this.plans.length; j++) {
        teacher.push({
          date: 't-' + `${i + 1}` + '-' + `${j + 1}`, data: this.teacher[j][i].plan
        });
      }
      office.push({date: 'o-' + `${i + 1}`, data: this.office[i].plan});
    }

    console.log(teacher);
    console.log(office);
    this.shiftService.applyShift({id: this.id, year: this.year, month: this.month}, teacher, office)
      .then((d) => {
          if (d === 0) {
            this.commonService.openBar('適用しました', 2000);
            this.teacher.length = 0;
            this.office.length = 0;
            this.base_dataCalendar(this.date.length);
          } else {
            this.commonService.openBar('Error:' + d, 2000);
            this.teacher.length = 0;
            this.office.length = 0;
            this.base_dataCalendar(this.date.length);
          }
        }
      );
  }
}

interface Date {
  day: number;
  week: string;
  schedule: string;
}

interface Teacher {
  display: string;
  plan: number;
  color: string;
}

interface Office {
  display: string;
  plan: string;
  color: string;
}

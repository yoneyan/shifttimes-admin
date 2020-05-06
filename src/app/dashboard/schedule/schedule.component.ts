import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../service/common.service';
import {ActivatedRoute} from '@angular/router';
import {ScheduleService} from '../../service/schedule.service';
import {ShiftService} from '../../service/shift.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {


  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private shiftService: ShiftService,
    private commonService: CommonService,
  ) {
  }

  public schedule: Datas[] = new Array();
  public month: number;
  public year: number;
  public info = '';
  public log: string;
  private endDayCount: number;
  private startDate: any;
  public loading = 100;
  private weeks = ['日', '月', '火', '水', '木', '金', '土'];
  public comment = new FormControl();

  ngOnInit(): void {
    this.loading = 0;
    this.dateToday();
    this.getCalendar();
  }

  dataInit(): void {
    this.loading = 0;
    this.schedule.length = 0;
    this.info = '';
    this.endDayCount = 0;
    this.startDate = 0;
  }

  prevMonth(): void {
    if (this.loading === 100) {
      this.dataInit();
      this.month = this.month - 1;
      if (this.month < 1) {
        this.year = this.year - 1;
        this.month = 12;
      }
      this.loading = this.loading + 10;
      this.calendar();
      this.getCalendar();
    } else {
      this.commonService.openBar('現在データを読み込み中です。しばらく待ってください', 2000);
    }
  }

  nextMonth(): void {
    if (this.loading === 100) {
      this.dataInit();
      this.month = this.month + 1;
      if (this.month > 12) {
        this.year = this.year + 1;
        this.month = 1;
      }
      this.loading = this.loading + 10;
      this.calendar();
      this.getCalendar();
    } else {
      this.commonService.openBar('現在データを読み込み中です。しばらく待ってください', 2000);
    }
  }

  dateToday(): void {
    const date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.loading = this.loading + 10;
    this.calendar();
  }

  calendar(): void {
    this.startDate = new Date(this.year, this.month - 1, 1);
    this.endDayCount = new Date(this.year, this.month, 0).getDate();
    let day = this.startDate.getDay();

    for (let i = 1; i <= this.endDayCount; i++) {
      this.schedule.push({date: i, week: this.weeks[day], schedule: ''});
      if (day === 6) {
        day = 0;
      } else {
        day++;
      }
    }
    this.loading = this.loading + 30;
  }

  getCalendar(): void {
    this.loading = this.loading + 20;
    this.shiftService.getCalendar({year: this.year, month: this.month})
      .then((data) => {
        if (data === 0) {
          for (let i = 1; i <= this.endDayCount; i++) {
            this.schedule[i - 1].schedule = 'データなし';
          }
        } else {
          this.info = data.info;
          for (let i = 1; i <= this.endDayCount; i++) {
            let tmp: string;
            if (data[i] === 0) {
              tmp = '閉校';
            } else if (data[i] === 1) {
              tmp = '自習室のみ';
            } else if (data[i] === 2) {
              tmp = '開校';
            } else {
              tmp = 'データなし';
            }
            this.schedule[i - 1].schedule = tmp;
          }
        }
        this.loading = this.loading + 40;
      });
  }

  autoSetting(): void {
    let day = this.startDate.getDay();

    for (let i = 1; i <= this.endDayCount; i++) {
      if (day === 0 || 1) {
        this.schedule[i - 1].schedule = '閉校';
      } else {
        this.schedule[i - 1].schedule = '開校';
      }
      if (day === 6) {
        day = 0;
      } else {
        day++;
      }
    }
  }

  apply(): void {
    const data: number[] = new Array();
    for (const s of this.schedule) {
      if (s.schedule === '開校') {
        data.push(2);
      } else if (s.schedule === '自習室のみ') {
        data.push(1);
      } else {
        data.push(0);
      }
    }
    this.scheduleService.scheduleRegister({
      year: this.year,
      month: this.month,
      data,
      information: this.comment.value
    });
    this.info = this.comment.value;
  }

  open(d): void {
    this.schedule[d - 1].schedule = '開校';
  }

  onlyStudyRoom(d): void {
    this.schedule[d - 1].schedule = '自習室のみ';
  }

  close(d): void {
    this.schedule[d - 1].schedule = '閉校';
  }

}


interface Datas {
  date: number;
  week: string;
  schedule: string;
}


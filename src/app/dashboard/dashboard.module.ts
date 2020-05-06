import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {NoticeComponent} from './notice/notice.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {UserComponent} from './user/user.component';
import {MatCard, MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { ScheduleComponent } from './schedule/schedule.component';


@NgModule({
  declarations: [
    DashboardComponent,
    NoticeComponent,
    UserComponent,
    ScheduleComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
  ],
  exports: [
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
  ]
})
export class DashboardModule {
}

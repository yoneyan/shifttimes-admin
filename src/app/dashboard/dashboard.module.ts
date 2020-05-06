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
import {ScheduleComponent} from './schedule/schedule.component';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import { ShiftComponent } from './shift/shift.component';
import {MatTabsModule} from '@angular/material/tabs';
import { AdduserComponent } from './adduser/adduser.component';
import { UsersettingComponent } from './usersetting/usersetting.component';


@NgModule({
  declarations: [
    DashboardComponent,
    NoticeComponent,
    UserComponent,
    ScheduleComponent,
    ShiftComponent,
    AdduserComponent,
    UsersettingComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    FormsModule,
    MatTabsModule,
  ],
  exports: [
    MatCardModule,
    MatSidenavModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    FormsModule,
  ]
})
export class DashboardModule {
}

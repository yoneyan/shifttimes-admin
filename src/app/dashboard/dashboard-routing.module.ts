import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {NoticeComponent} from './notice/notice.component';
import {UserComponent} from './user/user.component';
import {AuthGuard} from '../guard/auth.guard';
import {ScheduleComponent} from './schedule/schedule.component';
import {ShiftComponent} from './shift/shift.component';
import {AdduserComponent} from './adduser/adduser.component';
import {SettingComponent} from './user/setting.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'notice', pathMatch: 'full'},
      {path: 'notice', component: NoticeComponent},
      {path: 'user/add', component: AdduserComponent},
      {path: 'user/setting', component: SettingComponent},
      {path: 'user', component: UserComponent},
      {path: 'schedule', component: ScheduleComponent},
      {path: 'shift/:id/:year/:month', component: ShiftComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}

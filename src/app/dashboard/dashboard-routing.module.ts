import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {NoticeComponent} from './notice/notice.component';
import {UserComponent} from './user/user.component';
import {AuthGuard} from '../guard/auth.guard';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'notice', pathMatch: 'full'},
      {path: 'notice', component: NoticeComponent},
      {path: 'user', component: UserComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AlertScreenComponent} from './alert-screen/alert-screen.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Dashboard',
    },
  },
  {
    path: 'alerts',
    component: AlertScreenComponent,
    data: {
      title: 'Dashboard',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

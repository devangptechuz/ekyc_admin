import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminProfileComponent} from './admin-profile/admin-profile.component';


const routes: Routes = [
  {
    path: 'admin-profile',
    component: AdminProfileComponent,
    data: {
      title: 'admin-profile',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { CreateFormComponent } from './create-form/create-form.component';


const routes: Routes = [
  {
    path: 'admin-profile',
    component: AdminProfileComponent,
    data: {
      title: 'admin-profile',
    },
  },
  {
    path: 'dynamic-form',
    component: CreateFormComponent,
    data: {
      title: 'Create Dynamic Form',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }

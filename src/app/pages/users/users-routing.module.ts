import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersDetailComponent } from './users-detail/users-detail.component';
import { ListApplicationComponent } from './list-application/list-application.component';
import { AddEditUser } from './shared/add-edit.resolver';
import {EditApplicationComponent} from './edit-application/edit-application.component';

const routes: Routes = [
  {
    path: '',
    component: ListApplicationComponent,
    data: {
      title: 'list-application',
    },
  },
  {
    path: 'edit/edit-application',
    component: EditApplicationComponent
  },
  {
    path: ':id',
    component: UsersDetailComponent,
    data: {
      title: 'user-detail',
    },
    resolve: { user: AddEditUser }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersDetailComponent } from './users-detail/users-detail.component';
import { ListApplicationComponent } from './list-application/list-application.component';
import { AddEditUser } from './shared/add-edit.resolver';
import { EditApplicationComponent } from './edit-application/edit-application.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import { BankDetailComponent } from './bank-detail/bank-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ListApplicationComponent,
    data: {
      title: 'list-application',
    },
  },
  {
    path: 'details/:id',
    component: UsersDetailComponent,
    data: {
      title: 'user-detail',
    },
    resolve: { user: AddEditUser }
  },
  {
    path: 'edit-application',
    component: EditApplicationComponent,
    data: {
      title: 'edit-application',
    },
  },
  {
    path: 'user-history',
    component: UserHistoryComponent,
    data: {
      title: 'user-history',
    },
  },
  {
    path: 'bank-detail',
    component: BankDetailComponent,
    data: {
      title: 'bank-detail',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }

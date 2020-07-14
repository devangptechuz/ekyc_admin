import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersDetailComponent } from './users-detail/users-detail.component';

const routes: Routes = [
  {
    path: '',
    component: UsersDetailComponent,
    data: {
      title: 'user-detail',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }

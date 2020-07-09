import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListSubAdminComponent} from './list-sub-admin/list-sub-admin.component';
import {AddEditSubAdminComponent} from './add-edit-sub-admin/add-edit-sub-admin.component';


const routes: Routes = [
  {
    path: '',
    component: ListSubAdminComponent,
    data: {
      title: 'sub-admin-list',
    },
  },{
    path: 'add-admin',
    component: AddEditSubAdminComponent,
    data: {
      title: 'sub-admin-list',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubAdminRoutingModule { }

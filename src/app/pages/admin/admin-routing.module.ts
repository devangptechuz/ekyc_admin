import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListAdminComponent} from './list-admin/list-admin.component';
import {AddEditAdminComponent} from './add-edit-admin/add-edit-admin.component';
import {AddEditAdmin} from './shared/add-edit.resolver';


const routes: Routes = [
  {
    path: '',
    component: ListAdminComponent,
    data: {
      title: 'admin-list',
    },
  },{
    path: 'add-admin',
    component: AddEditAdminComponent,
    data: {
      title: 'admin-list',
    },
  },
  {
    path: 'edit-admin/:id',
    component: AddEditAdminComponent,
    resolve: { admin: AddEditAdmin }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

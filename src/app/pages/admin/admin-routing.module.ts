import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListAdminComponent} from './list-admin/list-admin.component';
import {AddEditAdminComponent} from './add-edit-admin/add-edit-admin.component';
import {AddEditAdmin} from './shared/add-edit.resolver';
import {AdminProfileComponent} from './admin-profile/admin-profile.component';


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
    data: {
      title: 'edit-admin',
    },
    resolve: { admin: AddEditAdmin }
  },
  {
    path: 'admin-profile',
    component: AdminProfileComponent,
    data: {
      title: 'admin-profile',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

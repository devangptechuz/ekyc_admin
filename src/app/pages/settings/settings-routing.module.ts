import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateFormComponent } from './create-form/create-form.component';
import {AdminProfileComponent} from './admin-profile/admin-profile.component';
import {CategoryResolver} from './shared/category.resolver';
import {SubCategoryComponent} from './sub-category/sub-category.component';

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
    },
  },
  {
    path: 'sub-category/:id',
    component: SubCategoryComponent,
    data: {
      title: 'category',
    },
    resolve: { category: CategoryResolver }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }

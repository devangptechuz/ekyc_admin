import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GlobalConfigureComponent } from './global-configure/global-configure.component';
import { CompanyComponent } from './company/company.component';
import { ListEmailTemplateComponent } from './email-template/list-email-template/list-email-template.component';
import { AddEditEmailTemplateComponent } from './email-template/add-edit-email-template/add-edit-email-template.component';
import { AddEditEmailTemplate } from './email-template/shared/add-edit.resolver';

const routes: Routes = [
  {
    path: '',
    component: GlobalConfigureComponent,
    data: {
      title: 'Global Configure',
    },
  },
  {
    path: 'company',
    component: CompanyComponent,
    data: {
      title: 'Company Configure',
    },
  },
  {
    path: 'list-email-template',
    component: ListEmailTemplateComponent,
    data: {
      title: 'Email Template List',
    },
  },
  {
    path: 'add-email-template',
    component: AddEditEmailTemplateComponent,
    data: {
      title: 'Add Email Template',
    },
  },
  {
    path: 'edit-email-template/:id',
    component: AddEditEmailTemplateComponent,
    data: {
      title: 'Edit Email Template',
    },
    resolve: { getTemplate: AddEditEmailTemplate }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonConfigureRoutingModule { }

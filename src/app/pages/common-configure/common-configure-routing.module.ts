import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GlobalConfigureComponent } from './global-configure/global-configure.component';
import { EmailComponent } from './email/email.component';

const routes: Routes = [
  {
    path: '',
    component: GlobalConfigureComponent,
    data: {
      title: 'Global Configure',
    },
  },
  {
    path: 'email',
    component: EmailComponent,
    data: {
      title: 'Email Configure',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonConfigureRoutingModule { }

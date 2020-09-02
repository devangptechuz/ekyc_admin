import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GlobalConfigureComponent } from './global-configure/global-configure.component';


const routes: Routes = [
  {
    path: '',
    component: GlobalConfigureComponent,
    data: {
      title: 'Global Configure',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonConfigureRoutingModule { }

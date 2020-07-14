import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListApplicationComponent} from './list-application/list-application.component';


const routes: Routes = [
  {
    path: '',
    component: ListApplicationComponent,
    data: {
      title: 'list-application',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationsRoutingModule { }

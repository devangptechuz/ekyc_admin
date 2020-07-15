import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersDetailComponent } from './users-detail/users-detail.component';
import { ModelPopupComponent } from './model-popup/model-popup.component';


@NgModule({
  declarations: [UsersDetailComponent, ModelPopupComponent],
  imports: [
    CommonModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }

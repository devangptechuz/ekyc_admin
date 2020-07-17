import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ListAdminComponent } from './list-admin/list-admin.component';
import {AddEditAdminComponent} from './add-edit-admin/add-edit-admin.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgxSelectModule} from 'ngx-select-ex';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';


@NgModule({
  declarations: [ListAdminComponent,AddEditAdminComponent, AdminProfileComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgxDatatableModule,
    NgxSelectModule,
    ReactiveFormsModule.
    withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }

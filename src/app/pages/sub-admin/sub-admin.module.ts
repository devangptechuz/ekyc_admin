import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubAdminRoutingModule } from './sub-admin-routing.module';
import { ListSubAdminComponent } from './list-sub-admin/list-sub-admin.component';
import {AddEditSubAdminComponent} from './add-edit-sub-admin/add-edit-sub-admin.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [ListSubAdminComponent,AddEditSubAdminComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgxDatatableModule,
    ReactiveFormsModule.
    withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule,
    SubAdminRoutingModule
  ]
})
export class SubAdminModule { }

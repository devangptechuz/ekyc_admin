import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ListAdminComponent } from './list-admin/list-admin.component';
import { AddEditAdminComponent } from './add-edit-admin/add-edit-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSelectModule } from 'ngx-select-ex';
import { WebcamModule } from 'ngx-webcam';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
  declarations: [ListAdminComponent, AddEditAdminComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgxDatatableModule,
    FileUploadModule,
    WebcamModule,
    NgxSelectModule,
    ReactiveFormsModule.
      withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }

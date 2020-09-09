import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonConfigureRoutingModule } from './common-configure-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'app/shared/shared.module';
import { GlobalConfigureComponent } from './global-configure/global-configure.component';
import { CompanyComponent } from './company/company.component';
import { AddEditEmailTemplateComponent } from './email-template/add-edit-email-template/add-edit-email-template.component';
import { ListEmailTemplateComponent } from './email-template/list-email-template/list-email-template.component';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [GlobalConfigureComponent, CompanyComponent, AddEditEmailTemplateComponent, ListEmailTemplateComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.
      withConfig({ warnOnNgModelWithFormControl: 'never' }),
    NgxDatatableModule,
    NgxSelectModule,
    NgSelectModule,
    CKEditorModule,
    SharedModule,
    CommonConfigureRoutingModule
  ]
})
export class CommonConfigureModule { }

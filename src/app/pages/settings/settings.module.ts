import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { SettingsRoutingModule } from './settings-routing.module';
import { ApplicationPrefrenceComponent } from './application-prefrence/application-prefrence.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule } from 'ng2-file-upload';
import { WebcamModule } from 'ngx-webcam';
import { NgxSelectModule } from 'ngx-select-ex';
import { SharedModule } from '../../shared/shared.module';
import { ApplicationSettingComponent } from './application-setting/application-setting.component';
import { CreateFormComponent } from './create-form/create-form.component';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { PanelWrapperComponent } from './panel-wrapper.component';


@NgModule({
  declarations: [ApplicationPrefrenceComponent, AdminProfileComponent, ApplicationSettingComponent, CreateFormComponent],
  exports: [
    ApplicationPrefrenceComponent
  ],
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
    FormlyModule.forRoot({
      wrappers: [
        { name: 'panel', component: PanelWrapperComponent },
      ],
    }),
    FormlyBootstrapModule,
    DragDropModule,
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }

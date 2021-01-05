import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SettingsRoutingModule } from './settings-routing.module';
import { ApplicationPreferenceComponent } from './application-preference/application-preference/application-preference.component';
import { AdminProfileComponent } from './account-settings/admin-profile/admin-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule } from 'ng2-file-upload';
import { WebcamModule } from 'ngx-webcam';
import { NgxSelectModule } from 'ngx-select-ex';
import { SharedModule } from '../../shared/shared.module';
import { ApplicationSettingComponent } from './application-settings/application-setting/application-setting.component';
import { CreateFormComponent } from './create-form/create-form.component';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { PanelWrapperComponent } from './panel-wrapper.component';
import { SubCategoryComponent } from './application-settings/sub-category/sub-category.component';
import { AddEditCategoryComponent } from './application-settings/add-edit-sub-category/add-edit-category.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SegmentListComponent } from './segment-settings/segment-list/segment-list.component';
import { AddEditSegmentComponent } from './segment-settings/add-edit-segment/add-edit-segment.component';
import { SubSegmentListComponent } from './segment-settings/sub-segment-list/sub-segment-list.component';
import { AddEditSubSegmentComponent } from './segment-settings/add-edit-sub-segment/add-edit-sub-segment.component';
import { BrokeragePlanListComponent } from './brokerage-plan/brokerage-plan-list/brokerage-plan-list.component';
import { AddEditBrokeragePlanComponent } from './brokerage-plan/add-edit-brokerage-plan/add-edit-brokerage-plan.component';
import { NavTabComponent } from './nav-bar/nav-tab.component';
import { BrokerageCodeListComponent } from './brokerage-code/brokerage-code-list/brokerage-code-list.component';
import { AddEditBrokerageCodeComponent } from './brokerage-code/add-edit-brokerage-code/add-edit-brokerage-code.component';
import { NavBarReasonCategoryComponent } from './application-settings/nav-bar-reason-category/nav-bar-reason-category.component';
import { ReasonListComponent } from './application-settings/reason-list/reason-list.component';
import { AddEditReasonComponent } from './application-settings/add-edit-reason/add-edit-reason.component';
import { AddEditReasonCategoryComponent } from './application-settings/add-edit-reason-category/add-edit-reason-category.component';
import { ListPromocodeComponent } from './promotional/list-promocode/list-promocode.component';
import { AddEditPromocodeComponent } from './promotional/add-edit-promocode/add-edit-promocode.component';

@NgModule({
  declarations: [ApplicationPreferenceComponent, AdminProfileComponent, ApplicationSettingComponent, SubCategoryComponent, AddEditCategoryComponent, CreateFormComponent, PanelWrapperComponent, SegmentListComponent, AddEditSegmentComponent, SubSegmentListComponent, AddEditSubSegmentComponent, BrokeragePlanListComponent, AddEditBrokeragePlanComponent, NavTabComponent, BrokerageCodeListComponent, AddEditBrokerageCodeComponent, NavBarReasonCategoryComponent, ReasonListComponent, AddEditReasonComponent, AddEditReasonCategoryComponent, ListPromocodeComponent, AddEditPromocodeComponent],
  exports: [
    ApplicationPreferenceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgxDatatableModule,
    FileUploadModule,
    WebcamModule,
    NgxSelectModule,
    NgSelectModule,
    ReactiveFormsModule.
      withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule,
    FormlyModule,
    FormlyBootstrapModule,
    SettingsRoutingModule,
    DragDropModule
  ]
})
export class SettingsModule { }

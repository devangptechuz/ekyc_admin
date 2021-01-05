import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule } from 'ng2-file-upload';
import { WebcamModule } from 'ngx-webcam';
import { NgxSelectModule } from 'ngx-select-ex';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { SegmentRoutingModule } from './segment-routing.module';
import { SegmentListComponent } from './segment-settings/segment-list/segment-list.component';
import { AddEditSegmentComponent } from './segment-settings/add-edit-segment/add-edit-segment.component';
import { SubSegmentListComponent } from './segment-settings/sub-segment-list/sub-segment-list.component';
import { AddEditSubSegmentComponent } from './segment-settings/add-edit-sub-segment/add-edit-sub-segment.component';
import { BrokeragePlanListComponent } from './brokerage-plan/brokerage-plan-list/brokerage-plan-list.component';
import { AddEditBrokeragePlanComponent } from './brokerage-plan/add-edit-brokerage-plan/add-edit-brokerage-plan.component';
import { NavTabComponent } from './nav-bar/nav-tab.component';
import { BrokerageCodeListComponent } from './brokerage-code/brokerage-code-list/brokerage-code-list.component';
import { AddEditBrokerageCodeComponent } from './brokerage-code/add-edit-brokerage-code/add-edit-brokerage-code.component';


@NgModule({
  declarations: [SegmentListComponent, AddEditSegmentComponent, SubSegmentListComponent, AddEditSubSegmentComponent, BrokeragePlanListComponent, AddEditBrokeragePlanComponent, NavTabComponent, BrokerageCodeListComponent, AddEditBrokerageCodeComponent],
  imports: [
    CommonModule,
    SegmentRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxDatatableModule,
    FileUploadModule,
    WebcamModule,
    NgxSelectModule,
    NgSelectModule,
    ReactiveFormsModule.
      withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule
  ]
})
export class SegmentModule { }

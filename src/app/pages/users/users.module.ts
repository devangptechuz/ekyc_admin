import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamModule } from 'ngx-webcam';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { SignaturePadModule } from '@ng-plus/signature-pad';

import { UsersRoutingModule } from './users-routing.module';
import { UsersDetailComponent } from './users-detail/users-detail.component';
import { ModelPopupComponent } from './model-popup/model-popup.component';
import { UserService } from 'app/shared/services/user.service';
import { ListApplicationComponent } from './list-application/list-application.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgSelectModule } from '@ng-select/ng-select';
import { FileUploadModule } from 'ng2-file-upload';

import { SharedModule } from 'app/shared/shared.module';
import { EditApplicationComponent } from './edit-application/edit-application.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import { BankDetailComponent } from './bank-detail/bank-detail.component';
import { EditPersoanlAddressDetailsComponent } from './edit-persoanl-address-details/edit-persoanl-address-details.component';
import { InPersonVideoComponent } from './document-modal/in-person-video/in-person-video.component';
import { ImagePopupComponent } from './document-modal/image-popup/image-popup.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { TradingDetailsComponent } from './trading-details/trading-details.component';

@NgModule({
  declarations: [ListApplicationComponent, UsersDetailComponent, ModelPopupComponent, EditApplicationComponent,
    UserHistoryComponent, BankDetailComponent, EditPersoanlAddressDetailsComponent,
    InPersonVideoComponent,
    ImagePopupComponent,
    TradingDetailsComponent],
  imports: [
    CommonModule,
    WebcamModule,
    FormsModule,
    HttpClientModule,
    FormlyModule.forRoot(),
    FormlyBootstrapModule,
    NgxDatatableModule,
    NgxSelectModule,
    NgSelectModule,
    SignaturePadModule,
    FileUploadModule,
    NgxMaskModule.forRoot(),
    ReactiveFormsModule.
      withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }

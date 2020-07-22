import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamModule } from 'ngx-webcam';
import { NgxMaskModule, IConfig } from 'ngx-mask';

import { UsersRoutingModule } from './users-routing.module';
import { UsersDetailComponent } from './users-detail/users-detail.component';
import { ModelPopupComponent } from './model-popup/model-popup.component';
import { UserService } from 'app/shared/services/user.service';
import { ListApplicationComponent } from './list-application/list-application.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSelectModule } from 'ngx-select-ex';
import { SharedModule } from 'app/shared/shared.module';
import { EditApplicationComponent } from './edit-application/edit-application.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import { BankDetailComponent } from './bank-detail/bank-detail.component';
import { EditPersoanlAddressDetailsComponent } from './edit-persoanl-address-details/edit-persoanl-address-details.component';

@NgModule({
  declarations: [ListApplicationComponent, UsersDetailComponent, ModelPopupComponent, EditApplicationComponent, UserHistoryComponent, BankDetailComponent, EditPersoanlAddressDetailsComponent],
  imports: [
    CommonModule,
    WebcamModule,
    FormsModule,
    HttpClientModule,
    NgxDatatableModule,
    NgxSelectModule,
    NgxMaskModule.forRoot(),
    ReactiveFormsModule.
      withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }

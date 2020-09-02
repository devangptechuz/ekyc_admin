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


@NgModule({
  declarations: [GlobalConfigureComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.
      withConfig({ warnOnNgModelWithFormControl: 'never' }),
    NgxDatatableModule,
    NgxSelectModule,
    NgSelectModule,
    SharedModule,
    CommonConfigureRoutingModule
  ]
})
export class CommonConfigureModule { }

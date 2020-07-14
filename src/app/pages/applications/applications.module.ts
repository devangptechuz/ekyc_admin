import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationsRoutingModule } from './applications-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgxSelectModule} from 'ngx-select-ex';
import {ListApplicationComponent} from './list-application/list-application.component';

@NgModule({
  declarations: [ListApplicationComponent ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgxDatatableModule,
    NgxSelectModule,
    ReactiveFormsModule.
    withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule,
    ApplicationsRoutingModule
  ]
})
export class ApplicationsModule { }

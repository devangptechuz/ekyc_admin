import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {HttpClientModule} from '@angular/common/http';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {RecentAlertsComponent} from './recent-alerts/recent-alerts.component';
import { RecentApplicationComponent } from './recent-application/recent-application.component';

@NgModule({
  declarations: [DashboardComponent, RecentAlertsComponent, RecentApplicationComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgxDatatableModule,
    ReactiveFormsModule.
    withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }

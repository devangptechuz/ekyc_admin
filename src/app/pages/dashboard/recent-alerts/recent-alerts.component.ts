import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';
import {SettingService} from '../../../shared/services/setting.service';
import {GlobalService} from '../../../shared/services/global.service';

@Component({
  selector: 'app-recent-alerts',
  templateUrl: './recent-alerts.component.html',
  styleUrls: ['./recent-alerts.component.scss']
})
export class RecentAlertsComponent implements OnInit {

  rows = [];
  temp = [];
  loadingIndicator = true;
  limitRow = 3;
  selectedItem;
  perPage = [
    { label: '10', value: '10' },
    { label: '15', value: '15' },
  ];
  footerMessage = {
    'totalMessage': 'Total'
  };

  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private settingService: SettingService,
    public global: GlobalService
  ) { }

  ngOnInit() {
    this.settingService.getRecentAlerts()
        .subscribe(
            Data => {
              if (Data.success) {
                this.temp = [...Data['result']['reasonDataAlert']];
                this.rows = Data['result']['reasonDataAlert'];
              } else {
                this.global.errorToastr(Data.message);
              }
            });
  }

}

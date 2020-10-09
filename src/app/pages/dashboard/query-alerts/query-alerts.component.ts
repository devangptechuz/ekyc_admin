import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';
import { SettingService } from '../../../shared/services/setting.service';
import { GlobalService } from '../../../shared/services/global.service';
import { ConfirmationDialogService } from 'app/shared/services/confirmation-dialoge.service';

@Component({
  selector: 'app-query-alerts',
  templateUrl: './query-alerts.component.html',
  styleUrls: ['./query-alerts.component.scss']
})
export class QueryAlertsComponent implements OnInit {

  rows = [];
  temp = [];
  loadingIndicator = true;
  limitRow = 5;
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
    public global: GlobalService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit() {
    this.getAllQueryList();
  }

  getAllQueryList(hideLoader: boolean = false) {
    this.settingService.getQueryList()
      .subscribe(
        Data => {
          if (Data.success) {
            this.temp = [...Data['result']['queryDataAlert']];
            this.rows = Data['result']['queryDataAlert'];
          } else {
            this.global.errorToastr(Data.message);
          }
        });
  }

  QueryDetails(details: any) {
    const label = 'Application';
    let objParam = {}
    objParam['id'] = details['id'];
    objParam['subject'] = details['subject'];
    objParam['message'] = details['message'];
    objParam['title'] = 'Query Details';
    objParam['ok_button'] = 'Ok';

    this.confirmationDialogService.getDetails(objParam).then((data) => {
      if (data) {
        this.settingService.readQueryByAdmin(details['id']).subscribe((res: any) => {
          if (res.success) {
            this.getAllQueryList(true);
            this.global.successToastr(res.message);
          }
        });
      }
    }).catch(error => console.log(error));
  }

}

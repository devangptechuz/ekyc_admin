import {Component, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/global.service';
import {SettingService} from '../../../../shared/services/setting.service';

@Component({
  selector: 'app-application-setting',
  templateUrl: './application-setting.component.html',
  styleUrls: ['./application-setting.component.scss']
})
export class ApplicationSettingComponent implements OnInit {
  rows = [];
  temp = [];
  selected = [];
  loadingIndicator = true;
  limitRow: Number = environment.adminlimitRow;
  adminsSelectCount;
  count: any;
  deleteFlag = false;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
      private router: Router,
      private settingService: SettingService,
      private spinner: NgxSpinnerService,
      public global: GlobalService
  ) { }

  ngOnInit(): void {
    this.deleteFlag = false;
    this.settingService.getReasonCategory()
        .subscribe(
            Data => {
              if (Data.success) {
                this.temp = [...Data['result']['reasonCategory']];
                this.rows = Data['result']['reasonCategory'];
                this.spinner.hide();
              } else {
                this.spinner.hide();
                this.global.errorToastr(Data.message);
              }
            });
  }

  onEdit(v) {
    this.router.navigateByUrl(`/settings/sub-category/${v}`);
  }

  cancelAll() {
    // this.onSelect({ selected: [] });
    this.deleteFlag = false;
    this.selected = [];
    this.adminsSelectCount = 0;
  }

  setPage(pageInfo){
    window.scrollTo(0, 150);
  }

}

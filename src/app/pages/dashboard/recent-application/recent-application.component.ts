import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';
import {GlobalService} from '../../../shared/services/global.service';
import {UserService} from '../../../shared/services/user.service';

@Component({
  selector: 'app-recent-application',
  templateUrl: './recent-application.component.html',
  styleUrls: ['./recent-application.component.scss']
})
export class RecentApplicationComponent implements OnInit {

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
    private userService: UserService,
    public global: GlobalService
  ) { }

  ngOnInit(): void {
    this.userService.getUserApplicationList()
        .subscribe(
            Data => {
              if (Data.success) {
                this.temp = [...Data['result']['userList']];
                this.rows = Data['result']['userList'];
              } else {
                this.global.errorToastr(Data.message);
              }
            });
  }

}

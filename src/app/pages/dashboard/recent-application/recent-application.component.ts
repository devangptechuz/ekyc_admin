import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from "ngx-toastr";
import {Router} from '@angular/router';

@Component({
  selector: 'app-recent-application',
  templateUrl: './recent-application.component.html',
  styleUrls: ['./recent-application.component.scss']
})
export class RecentApplicationComponent implements OnInit {

  rows = [{
    'img':'assets/img/portrait/avatars/avatar-03.png',
    'username':'pragnesh',
    'accountType':'Equity',
    'status':'Submitted',
    'applicationID':'GP00421',
    'lastActivity':'Apr 22 2020-02:31PM'
  },{
    'img':'assets/img/portrait/avatars/avatar-04.png',
    'username':'ritu',
    'accountType':'IPO',
    'status':'Submitted',
    'applicationID':'GP00422',
    'lastActivity':'Apr 24 2020-02:21PM',
  }];
  temp = [];
  loadingIndicator = true;
  limitRow = '10';
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
      private router: Router
  ) { }

  ngOnInit(): void {
  }

}

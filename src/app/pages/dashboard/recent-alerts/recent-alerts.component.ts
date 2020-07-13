import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from "ngx-toastr";
import {Router} from '@angular/router';

@Component({
  selector: 'app-recent-alerts',
  templateUrl: './recent-alerts.component.html',
  styleUrls: ['./recent-alerts.component.scss']
})
export class RecentAlertsComponent implements OnInit {

  rows = [{
    'username':'pragnesh',
    'img':'assets/img/portrait/avatars/avatar-01.png',
    'AlertMessage':'Something',
    'StepName':'prg',
    'ApplicationID':'123',
    'DateofAlert':'02/11/1994',
    'status':'Active'
  },{
    'username':'devu',
    'img':'assets/img/portrait/avatars/avatar-02.png',
    'AlertMessage':'Something',
    'StepName':'dev',
    'ApplicationID':'123',
    'DateofAlert':'02/11/1985',
    'status':'Active'
  },{
    'username':'devu',
    'img':'assets/img/portrait/avatars/avatar-02.png',
    'AlertMessage':'Something',
    'StepName':'dev',
    'ApplicationID':'123',
    'DateofAlert':'02/11/1985',
    'status':'Active'
  },{
    'username':'devu',
    'img':'assets/img/portrait/avatars/avatar-02.png',
    'AlertMessage':'Something',
    'StepName':'dev',
    'ApplicationID':'123',
    'DateofAlert':'02/11/1985',
    'status':'Active'
  }];
  temp = [];
  loadingIndicator = true;
  limitRow = '3';
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

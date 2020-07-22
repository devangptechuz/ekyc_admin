import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';

@Component({
  selector: 'app-recent-alerts',
  templateUrl: './recent-alerts.component.html',
  styleUrls: ['./recent-alerts.component.scss']
})
export class RecentAlertsComponent implements OnInit {

  rows = [{
    'username': 'pragnesh',
    'img': 'assets/img/portrait/avatars/avatar-01.png',
    'AlertMessage': 'Something',
    'mobileNumber': '9039484848',
    'ApplicationID': '12390890',
    'DateofAlert': '02/11/1994',
    'status': 'Active'
  }, {
    'username': 'devu',
    'img': 'assets/img/portrait/avatars/avatar-02.png',
    'AlertMessage': 'Something',
    'mobileNumber': '7939484848',
    'ApplicationID': '12390891',
    'DateofAlert': '02/11/1985',
    'status': 'Active'
  }, {
    'username': 'devud',
    'img': 'assets/img/portrait/avatars/avatar-02.png',
    'AlertMessage': 'Something',
    'mobileNumber': '9039498437',
    'ApplicationID': '12390892',
    'DateofAlert': '02/11/1985',
    'status': 'Active'
  }, {
    'username': 'devang',
    'img': 'assets/img/portrait/avatars/avatar-02.png',
    'AlertMessage': 'Something',
    'mobileNumber': '9839499037',
    'ApplicationID': '12390893',
    'DateofAlert': '02/11/1985',
    'status': 'Active'
  }, {
    'username': 'dev_test',
    'img': 'assets/img/portrait/avatars/avatar-02.png',
    'AlertMessage': 'Something',
    'mobileNumber': '9039498436',
    'ApplicationID': '12390894',
    'DateofAlert': '02/11/1985',
    'status': 'Active'
  }, {
    'username': 'devli',
    'img': 'assets/img/portrait/avatars/avatar-02.png',
    'AlertMessage': 'Something',
    'mobileNumber': '9039477437',
    'ApplicationID': '12312390895',
    'DateofAlert': '02/11/1985',
    'status': 'Active'
  }, {
    'username': 'ritesh',
    'img': 'assets/img/portrait/avatars/avatar-02.png',
    'AlertMessage': 'Something',
    'mobileNumber': '9039489102',
    'ApplicationID': '12312390897',
    'DateofAlert': '02/11/1985',
    'status': 'Active'
  }];
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
    private router: Router
  ) { }

  ngOnInit(): void {
  }

}

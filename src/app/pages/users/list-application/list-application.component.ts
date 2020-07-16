import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-application',
  templateUrl: './list-application.component.html',
  styleUrls: ['./list-application.component.scss']
})
export class ListApplicationComponent implements OnInit {

  rows = [{
    'firstname': 'pragnesh',
    'lastname': 'panchal',
    'img': 'assets/img/portrait/avatars/avatar-05.png',
    'email': 'pragnesh@techuz.com',
    'status': 'Incomplete'
  }, {
    'firstname': 'pragnesh',
    'lastname': 'patel',
    'img': 'assets/img/portrait/avatars/avatar-04.png',
    'email': 'pragnesh@techuz.com',
    'status': 'Submitted'
  }, {
    'firstname': 'prg',
    'lastname': 'panchal',
    'img': 'assets/img/portrait/avatars/avatar-04.png',
    'email': 'pragnesh@techuz.com',
    'status': 'Approved'
  }, {
    'firstname': 'abcd',
    'lastname': 'aaaa',
    'img': 'assets/img/portrait/avatars/avatar-04.png',
    'email': 'pragnesh@techuz.com',
    'status': 'Rejected'
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
  onEdit(e) {
    console.log("edit page");
  }
  onDelete(e, v) {
    console.log("Delete data");
  }

}

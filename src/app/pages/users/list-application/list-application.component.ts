import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from 'app/shared/services/user.service';
import { GlobalService } from 'app/shared/services/global.service';
import { AdminService } from 'app/shared/services/admin.service';
import { ConfirmationDialogService } from '../../../shared/services/confirmation-dialoge.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list-application',
  templateUrl: './list-application.component.html',
  styleUrls: ['./list-application.component.scss']
})
export class ListApplicationComponent implements OnInit {

  rows = [];
  temp = [];
  selected = [];
  loadingIndicator = true;
  limitRow: Number = environment.userlimitRow;
  selectedItem;
  count: any;
  deleteFlag = false;
  usersSelectCount;
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
    private spinner: NgxSpinnerService,
    private confirmationDialogService: ConfirmationDialogService,
    private global: GlobalService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getUserList().subscribe((Data: any) => {
      if (Data.success) {
        this.temp = [...Data['result']['userList']];
        this.rows = Data['result']['userList'];
        this.count = Data['result']['Count'];
        // this.spinner.hide();
      } else {
        // this.spinner.hide();
        this.global.errorToastr(Data.message);
      }
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows = this.temp.filter((d) => {
      return d.email.toLowerCase().indexOf(val) !== -1 || !val ||
        d.mobileNumber.toLowerCase().indexOf(val) !== -1 || !val ||
        d.userName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.table.offset = 0;
  }

  onEdit(e) {
    console.log("edit page");
  }

  cancelAll() {
    this.onSelect({ selected: [] });
    this.selected.length = 0;
    this.deleteFlag = false;
  }

  onSelect(row) {
    this.deleteFlag = this.selected.length > 0;
    this.usersSelectCount = this.selected.length
  }

  deleteUsers() {
    if (this.selected.length > 0) {
      const id = [];
      this.selected.filter((data) => {
        id.push(data.id);
      })
      this.confirmationDialogService.confirm('Admins').then((data) => {
        if (data) {
          this.spinner.show();
          this.userService.deleteUser({ id: id })
            .subscribe((res) => {
              if (res.success) {
                this.spinner.hide();
                this.global.successToastr('Deleted Successfully')
                this.ngOnInit();
              } else {
                this.spinner.hide();
                this.global.errorToastr(res.message);
              }
            });
        }
      }).catch(error => console.log(error));
    }
  }

  onDelete(e, v) {
    console.log("Delete data");
  }
}

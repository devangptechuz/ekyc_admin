import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from 'app/shared/services/user.service';
import { GlobalService } from 'app/shared/services/global.service';
import { AdminService } from 'app/shared/services/admin.service';
import { ConfirmationDialogService } from '../../../shared/services/confirmation-dialoge.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../environments/environment';
import { isArray } from 'util';

@Component({
  selector: 'app-list-application',
  templateUrl: './list-application.component.html',
  styleUrls: ['./list-application.component.scss']
})
export class ListApplicationComponent implements OnInit {
  @ViewChild('searchBytype') searchBytype: ElementRef;
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
  footerMessage = {};

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
      } else {
        this.global.errorToastr(Data.message);
      }
    });
  }

  resetFilter($event) {
    if (!$event.target.value) {
      this.ngOnInit();
    }
  }

  updateFilter(event) {
    const searchBytype = this.searchBytype.nativeElement.value;
    if (!searchBytype) {
      this.global.errorToastr('Search box is empty')
    }
    const val = searchBytype.toLowerCase();
    this.rows = this.temp.filter((d) => {
      return d.email.toLowerCase().indexOf(val) !== -1 || !val ||
        d.mobileNumber.toLowerCase().indexOf(val) !== -1 || !val ||
        d.userName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.table.offset = 0;
  }

  // onActivate(event) {
  //   if (event.type === 'click') {
  //     this.router.navigate(['applications/details', event.row.id]);
  //   }
  // }

  onEdit(e) {
    console.log("edit page");
  }

  cancelAll() {
    // this.onSelect({ selected: [] });
    this.deleteFlag = false;
    this.selected = [];
    this.usersSelectCount = 0;
  }
  /**
   * on select deselect event
   */
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    if (this.selected.length) {
      this.usersSelectCount = this.selected.length;
      this.deleteFlag = this.selected.length > 0;
    } else {
      this.cancelAll();
    }
  }

  /**
   * delete application event
   */
  rejectApproveApplications(approveReject: string) {
    if (this.selected.length > 0) {
      const id = [];
      this.selected.filter((data) => {
        id.push(data.id);
      });
      if (approveReject === 'approved') {
        this.approveConfirmServiceCall('Applications', id);
      } else if (approveReject === 'reject') {
        this.rejectConfirmServiceCall('Applications', id);
      }
    }
  }
  /**
   * reject confirmation modal popup
   * @param label 
   * @param id 
   */
  approveConfirmServiceCall(label: any, id: any) {
    let objParam = {};
    if (isArray(id)) {
      objParam['id'] = id;
    } else {
      objParam['id'] = [id];
      label = 'Application';
    }
    if (this.selected.length > 0) {
      this.confirmationDialogService.approveConfirm(label, objParam['id']).then((data) => {
        if (data) {
          objParam['api_name'] = 'approved';
          this.userService.approveRejectUser(objParam)
            .subscribe((res) => {
              if (res.success) {
                if (res.message) {
                  this.global.successToastr(res.message);
                } else {
                  this.global.successToastr('Approved Successfully');
                }
                this.ngOnInit();
              } else {
                this.global.errorToastr(res.message);
              }
            });
        }
      }).catch(error => console.log(error));
    }
  }

  /**
   * reject confirmation modal popup
   * @param label 
   * @param id 
   */
  rejectConfirmServiceCall(label: any, id: any) {
    let objParam = {};
    if (isArray(id)) {
      objParam['id'] = id;
    } else {
      objParam['id'] = [id];
      label = 'Application';
    }
    if (this.selected.length > 0) {
      this.confirmationDialogService.rejectConfirm(label, objParam['id']).then((data) => {
        if (data) {
          objParam['api_name'] = 'reject';
          this.userService.approveRejectUser(objParam)
            .subscribe((res) => {
              if (res.success) {
                if (res.message) {
                  this.global.successToastr(res.message);
                } else {
                  this.global.successToastr('Rejected Successfully');
                }
                this.ngOnInit();
              } else {
                this.global.errorToastr(res.message);
              }
            });
        }
      }).catch(error => console.log(error));
    }
  }

  /**
   * delete application event
   */
  deleteApplications() {
    if (this.selected.length > 0) {
      const id = [];
      this.selected.filter((data) => {
        id.push(data.id);
      });
      this.deleteConfirmServiceCall('Applications', id);
    }
  }

  onDelete(id) {
    this.deleteConfirmServiceCall('Application', id);
  }

  deleteConfirmServiceCall(label: any, id: any) {
    let objParam = {};
    if (isArray(id)) {
      objParam['id'] = id;
    } else {
      objParam['id'] = [id];
    }
    if (this.selected.length > 0) {
      // const id = [];
      // this.selected.filter((data) => {
      //   id.push(data.id);
      // })
      this.confirmationDialogService.confirm(label).then((data) => {
        if (data) {
          this.spinner.show();
          this.userService.deleteUser(objParam)
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
}

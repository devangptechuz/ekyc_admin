import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from 'app/shared/services/user.service';
import { GlobalService } from 'app/shared/services/global.service';
import { AdminService } from 'app/shared/services/admin.service';
import { ConfirmationDialogService } from '../../../shared/services/confirmation-dialoge.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { applicationFilter } from '../shared/constant';
import { environment } from '../../../../environments/environment';
import { isArray } from 'util';

@Component({
  selector: 'app-list-application',
  templateUrl: './list-application.component.html',
  styleUrls: ['./list-application.component.scss']
})
export class ListApplicationComponent implements OnInit {
  @ViewChild('searchBytype') searchBytype: ElementRef;
  @ViewChild('searchBytypeAgain') searchBytypeAgain: ElementRef;

  rows = [];
  temp = [];
  tempOther = [];
  selected = [];
  item = applicationFilter;
  selectedPeople = [];
  loadingIndicator = true;
  limitRow: Number = environment.userlimitRow;
  selectedItem;
  searchValue:string = null;
  count: any;

  countUnderReview: number;
  countApproved: number;
  countRejected: number;

  deleteFlag = false;
  usersSelectCount;
  perPage = [
    { label: '10', value: '10' },
    { label: '15', value: '15' },
  ];
  footerMessage = {};
  typeOflist: string;

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
    this.getApplicationListByType();
    // this.userService.getUserList().subscribe((Data: any) => {
    //   if (Data.success) {
    //     this.temp = [...Data['result']['userList']];
    //     this.rows = Data['result']['userList'];
    //     this.count = Data['result']['all_count'];
    //   } else {
    //     this.global.errorToastr(Data.message);
    //   }
    // });
  }

  onEnterPress(event){
    if (event.keyCode === 13) {
      this.updateFilter(event);
    }
  }

  onEnterPressAgain(event){
    if (event.keyCode === 13) {
      this.updateFilterAgain(event);
    }
  }

  resetFilter(event) {
    if (!event.target.value && event.keyCode !== 13) {
      this.getApplicationListByType(this.typeOflist);
    }
  }

  public onClearAll() {

  }

  removeText(){
    this.searchValue = '';
    this.ngOnInit();
  }

  updateFilter(event) {
    const searchByType = this.searchBytype.nativeElement.value;
    const searchByKey = event.target.value;
    if (!searchByType && !searchByKey) {
     return this.global.errorToastr('Search box is empty')
    }
    const val = searchByType.toLowerCase() || searchByKey.toLowerCase();
    this.commonFunctionFilter(val);
  }

  updateFilterAgain(event) {
    const searchBytype = this.searchBytypeAgain.nativeElement.value;
    if (!searchBytype) {
     return this.global.errorToastr('Search box is empty')
    }
    const val = searchBytype.toLowerCase();
    this.commonFunctionFilter(val);
  }

  commonFunctionFilter(val){
    this.rows = this.temp.filter((d) => {
      return d.email.toLowerCase().indexOf(val) !== -1 || !val ||
          d.mobileNumber.toLowerCase().indexOf(val) !== -1 || !val ||
          d.userName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.table.offset = 0;
  }


  /**
   * Get application list by type(all,rejected,approved,under_review)
   * @param typeOflist
   */
  getApplicationListByType(typeOflist: any = '') {
    this.cancelAll();
    this.typeOflist = typeOflist;
    this.userService.getUserList(this.typeOflist).subscribe((Data: any) => {
      if (Data.success) {
        this.temp = [...Data['result']['userList']];
        this.rows = [...Data['result']['userList']];
        this.count = Data['result']['all_count'];
        this.countUnderReview = Data['result']['under_review_count'];
        this.countApproved = Data['result']['approved_count'];
        this.countRejected = Data['result']['rejected_count'];
      } else {
        this.global.errorToastr(Data.message);
      }
    });
  }

  cancelAll() {
    // this.onSelect({ selected: [] });
    this.deleteFlag = false;
    this.selected = [];
    this.usersSelectCount = 0;
    this.searchValue = '';
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
      } else if (approveReject === 'rejected') {
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
      objParam['userIds'] = id;
    } else {
      objParam['userIds'] = [id];
      label = 'Application';
    }

    let typeOfApplication = '';
    typeOfApplication = this.typeOflist;

    if (this.selected.length > 0) {
      objParam['type'] = 'Approve';
      this.confirmationDialogService.approveConfirm(label, objParam['userIds']).then((data) => {
        if (data) {
          this.userService.approveRejectApplication(objParam)
            .subscribe((res) => {
              if (res.success) {
                if (res.message) {
                  this.global.successToastr(res.message);
                } else {
                  this.global.successToastr('Approved Successfully');
                }
                this.getApplicationListByType(typeOfApplication);
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
      objParam['userIds'] = id;
    } else {
      objParam['userIds'] = [id];
      label = 'Application';
    }

    let typeOfApplication = '';
    typeOfApplication = this.typeOflist;

    if (this.selected.length > 0) {
      objParam['type'] = 'Reject';
      this.confirmationDialogService.rejectConfirm(label, objParam['userIds']).then((data) => {
        if (data) {
          this.userService.approveRejectApplication(objParam)
            .subscribe((res) => {
              if (res.success) {
                if (res.message) {
                  this.global.successToastr(res.message);
                } else {
                  this.global.successToastr('Rejected Successfully');
                }
                this.getApplicationListByType(typeOfApplication);
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

  setPage(pageInfo){
    window.scrollTo(0, 150);
  }
}

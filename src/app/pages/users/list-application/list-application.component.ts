import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
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
declare var $: any;

@Component({
  selector: 'app-list-application',
  templateUrl: './list-application.component.html',
  styleUrls: ['./list-application.component.scss']
})
export class ListApplicationComponent implements OnInit {
  @ViewChild('searchBytype') searchBytype: ElementRef;
  @ViewChild('searchBytypeAgain') searchBytypeAgain: ElementRef;

  create_application_url = environment.create_application_url;
  rows = [];
  temp = [];
  tempOther = [];
  selected = [];
  item = applicationFilter;
  selectedPeople = [];
  loadingIndicator = true;
  limitRow: Number = environment.userlimitRow;
  selectedItem;
  searchValue: string = null;
  count: any;

  countUnderReview: number;
  countApproved: number;
  countRejected: number;
  countFormInitiated: number;
  countEsignAwaited: number;
  countCompleted: number;

  deleteFlag = false;
  usersSelectCount;
  perPage = [
    { label: '10', value: '10' },
    { label: '15', value: '15' },
  ];
  footerMessage = {};
  typeOflist: string;

  filterSelected: any;
  from_date: any;
  to_date: any;

  events = [];

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

  onEnterPress(event) {
    if (event.keyCode === 13) {
      this.updateFilter(event);
    }
  }

  onEnterPressAgain(event) {
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
    this.filterSelected = '';
  }

  removeText() {
    this.searchValue = '';
    if (this.filterSelected || this.from_date || this.to_date) {
      this.searchBytype.nativeElement.value = '';
      this.submitFilter();
    } else {
      this.ngOnInit();
    }
  }

  updateFilter(event) {
    const searchByType = this.searchBytype.nativeElement.value;
    const searchByKey = event.target.value;

    if (!searchByType && !searchByKey) {
      return this.global.errorToastr('Search box is empty')
    }
    let val = '';
    if (searchByType) {
      val = searchByType.toLowerCase();
    } else if (searchByKey) {
      val = searchByType.toLowerCase();
    }
    this.searchBytypeAgain.nativeElement.value = val;
    this.searchBytype.nativeElement.value = val;
    this.searchValue = val;
    // const val = searchByType.toLowerCase() || searchByKey.toLowerCase();
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

  commonFunctionFilter(val: any) {
    this.submitFilter(val);
    // this.rows = this.temp.filter((d) => {
    //   return d.email.toLowerCase().indexOf(val) !== -1 || !val ||
    //     d.mobileNumber.toLowerCase().indexOf(val) !== -1 || !val ||
    //     d.panUserName.toLowerCase().indexOf(val) !== -1 || !val ||
    //     d.id.toLowerCase().indexOf(val) !== -1 || !val;
    // });
    // this.table.offset = 0;
  }

  clearDateFilter() {
    this.from_date = '';
    this.to_date = '';
  }


  applyDateRange() {
    if (this.from_date && this.to_date) {
      const fromDate = new Date(this.from_date['year'], this.from_date['month'], this.from_date['day']); //Today Date    
      const toDate = new Date(this.to_date['year'], this.to_date['month'], this.to_date['day']);
      if (fromDate > toDate) {
        this.toastr.error('Please select correct date range');
        return false;
      } else if ((this.from_date && !this.to_date) || (!this.from_date && this.to_date)) {
        this.toastr.error('Please select correct date range');
        return false;
      } else {
        this.submitFilter();
      }
    } else if (!this.from_date || !this.to_date) {
      this.toastr.error('Please select correct date range');
      return false;
    }
  }

  /**
   * Get filter selected from tabs default
   * @param typeOfTab 
   */
  getFilterMatchTab(typeOfTab: string = null) {
    if (typeOfTab === "under_review") {
      return "Under Review";
    } else if (typeOfTab === "approved") {
      return "Approved";
    } else if (typeOfTab === "rejected") {
      return "Rejected";
    } else if (typeOfTab === "FormInitiated") {
      return "Form Created";
    } else if (typeOfTab === "EmailSendForESign") {
      return "Email Send For Esign";
    } else if (typeOfTab === "Completed") {
      return "Esign Completed";
    }
  }

  /**
   * Submit filter and search by name
   */
  submitFilter(val: any = null) {
    let objParam = {};
    let sendParam = {};
    // let arrayAppStatus = [];
    // if (this.typeOflist) {
    //   if (this.filterSelected) {
    //     const splitAppStatus = this.filterSelected;
    //     splitAppStatus.map((item) => {
    //       arrayAppStatus.push(item['name']);
    //     });
    //   }
    // }

    sendParam['app_status'] = '';
    sendParam['from_date'] = '';
    sendParam['to_date'] = '';
    if (this.from_date && this.to_date) {
      const fromDate = new Date(this.from_date['year'], this.from_date['month'], this.from_date['day']); //Today Date    
      const toDate = new Date(this.to_date['year'], this.to_date['month'], this.to_date['day']);
      if (fromDate > toDate) {
        this.toastr.error('Please select correct date range');
        return false;
      } else if ((this.from_date && !this.to_date) || (!this.from_date && this.to_date)) {
        this.toastr.error('Please select correct date range');
        return false;
      } else {
        sendParam['from_date'] = `${this.from_date['day']}-${this.from_date['month']}-${this.from_date['year']}`;
        sendParam['to_date'] = `${this.to_date['day']}-${this.to_date['month']}-${this.to_date['year']}`;
      }
    }

    if (this.filterSelected && this.from_date && this.to_date) {
      objParam['application_type'] = this.filterSelected;
      objParam['from_date'] = this.from_date;
      objParam['to_date'] = this.to_date;
      let pushStatusItem = [];
      this.filterSelected.map((item) => {
        pushStatusItem.push((item['name']).replace(/\s+/g, ''));
      });
      sendParam['app_status'] = pushStatusItem.join(',');
    } else if (this.filterSelected && !this.from_date && !this.to_date) {
      objParam['application_type'] = this.filterSelected;
      objParam['from_date'] = this.from_date;
      objParam['to_date'] = this.to_date;
      let pushStatusItem = [];
      this.filterSelected.map((item) => {
        pushStatusItem.push((item['name']).replace(/\s+/g, ''));
      });
      sendParam['app_status'] = pushStatusItem.join(',');

    } else if (!this.filterSelected && this.from_date && this.to_date) {
      objParam['from_date'] = this.from_date;
      objParam['to_date'] = this.to_date;
    }
    sendParam['Search'] = '';
    this.searchBytype.nativeElement.value;
    if (this.searchBytype.nativeElement.value) {
      const val = this.searchBytype.nativeElement.value;
      this.searchValue = val;
      sendParam['Search'] = val.toLowerCase();
    }
    let getString = '';
    if (this.typeOflist) {
      this.filterSelected = '';
      const fiterMatchText = this.getFilterMatchTab(this.typeOflist);
      sendParam['app_status'] = fiterMatchText.replace(/\s+/g, '');
    }
    if (sendParam['app_status'] && sendParam['Search']) {
      getString += `app_status=${sendParam['app_status']}&Search=${sendParam['Search']}`;
    } else if (!sendParam['app_status'] && sendParam['Search']) {
      getString += `Search=${sendParam['Search']}`;
    } else if (sendParam['app_status'] && !sendParam['Search']) {
      getString += `app_status=${sendParam['app_status']}`;
    }
    if (sendParam['from_date'] && (sendParam['app_status'] || sendParam['Search'])) {
      getString += `&from_date=${sendParam['from_date']}`;
      getString += `&to_date=${sendParam['to_date']}`;
    } else if (sendParam['from_date'] && (!sendParam['app_status'] && !sendParam['Search'])) {
      getString += `from_date=${sendParam['from_date']}`;
      getString += `&to_date=${sendParam['to_date']}`;
    }
    this.userService.getSearchableApplicationList(getString).subscribe((Data: any) => {
      if (Data.success) {
        this.temp = [...Data['result']['userList']];
        this.rows = [...Data['result']['userList']];
        this.rows.sort((a, b) => a.id > b.id ? -1 : (a.id < b.id ? 1 : 0))
        this.count = Data['result']['all_count'];
        this.countUnderReview = Data['result']['under_review_count'];
        this.countApproved = Data['result']['approved_count'];
        this.countRejected = Data['result']['rejected_count'];
        this.countFormInitiated = Data['result']['form_awaited_count'];
        this.countEsignAwaited = Data['result']['esign_awaited_count'];
        this.countCompleted = Data['result']['esign_completed'];
      } else {
        this.global.errorToastr(Data.message);
      }
    });
  }

  /**
   * Get application list by type(all,rejected,approved,under_review)
   * @param typeOflist
   */
  getApplicationListByType(typeOflist: any = '') {
    this.typeOflist = typeOflist;
    console.log('is-same-tab', this.searchValue, 'valjuemodel', this.from_date, this.to_date);
    if (this.typeOflist) {
      this.filterSelected = '';
      const fiterMatchText = this.getFilterMatchTab(this.typeOflist);
      // console.log('fiterMatchText', fiterMatchText);
      let allFilters = this.item;
      const getCurrentTabFilter = allFilters.filter((ele) => ele.name === fiterMatchText);
      if (this.searchValue) {
        this.searchBytype.nativeElement.value = this.searchValue;
        this.searchBytypeAgain.nativeElement.value = this.searchValue;
      }
      this.filterSelected = getCurrentTabFilter;
    }
    if (this.typeOflist && this.searchValue || (this.from_date && this.to_date)) {
      this.submitFilter();
      return;
    } else {
      this.cancelAll();
      this.clearAllFilters();
      this.userService.getUserList(this.typeOflist).subscribe((Data: any) => {
        if (Data.success) {
          this.temp = [...Data['result']['userList']];
          this.rows = [...Data['result']['userList']];
          this.rows.sort((a, b) => a.id > b.id ? -1 : (a.id < b.id ? 1 : 0))
          this.count = Data['result']['all_count'];
          this.countUnderReview = Data['result']['under_review_count'];
          this.countApproved = Data['result']['approved_count'];
          this.countRejected = Data['result']['rejected_count'];
          this.countFormInitiated = Data['result']['form_awaited_count'];
          this.countEsignAwaited = Data['result']['esign_awaited_count'];
          this.countCompleted = Data['result']['esign_completed'];
        } else {
          this.global.errorToastr(Data.message);
        }
      });
    }
  }

  cancelAll() {
    // this.onSelect({ selected: [] });
    this.deleteFlag = false;
    this.selected = [];
    this.usersSelectCount = 0;
  }

  clearAllFilters() {
    this.searchValue = '';
    // this.searchBytype.nativeElement.value = this.searchValue;
    // thiss.searchBytypeAgain.nativeElement.value = this.searchValue;
    this.filterSelected = '';
    this.from_date = '';
    this.to_date = '';
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
    this.global.warningToastr('This feature is under developmeent.');
    return;
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

  setPage(pageInfo) {
    window.scrollTo(0, 150);
  }


  /**
   * Delete User Using PAN NUMBER
   * @param panUserName 
   */
  deleteUser(panUserName: any, id: any) {
    this.confirmationDialogService.confirm(panUserName).then((data) => {
      if (data) {
        const objParam = { 'panUserName': panUserName };
        this.spinner.show();
        this.userService.deleteUserTemp(objParam)
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

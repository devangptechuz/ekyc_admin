import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {ConfirmationDialogService} from '../../../shared/services/confirmation-dialoge.service';
import {GlobalService} from '../../../shared/services/global.service';
import {UserService} from '../../../shared/services/user.service';

@Component({
  selector: 'app-alert-screen',
  templateUrl: './alert-screen.component.html',
  styleUrls: ['./alert-screen.component.scss']
})
export class AlertScreenComponent implements OnInit {
  @ViewChild('searchBytype') searchBytype: ElementRef;

  rows = [];
  temp = [];
  tempOther = [];
  selected = [];
  // item = applicationFilter;
  selectedPeople = [];
  loadingIndicator = true;
  limitRow: Number = environment.userlimitRow;
  selectedItem;
  searchValue: string = null;
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
  constructor(private toastr: ToastrService,
              private router: Router,
              private spinner: NgxSpinnerService,
              private confirmationDialogService: ConfirmationDialogService,
              private global: GlobalService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.getAlerts();
  }

  onEnterPress(event) {
    if (event.keyCode === 13) {
      this.updateFilter(event);
    }
  }

  // onEnterPressAgain(event) {
  //   if (event.keyCode === 13) {
  //     this.updateFilterAgain(event);
  //   }
  // }

  resetFilter(event) {
    if (!event.target.value && event.keyCode !== 13) {
      this.getAlerts(this.typeOflist);
    }
  }

  public onClearAll() {

  }

  removeText() {
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

  // updateFilterAgain(event) {
  //   const searchBytype = this.searchBytypeAgain.nativeElement.value;
  //   if (!searchBytype) {
  //     return this.global.errorToastr('Search box is empty')
  //   }
  //   const val = searchBytype.toLowerCase();
  //   this.commonFunctionFilter(val);
  // }

  commonFunctionFilter(val) {
    this.rows = this.temp.filter((d) => {
      return d.email.toLowerCase().indexOf(val) !== -1 || !val ||
          d.mobileNumber.toLowerCase().indexOf(val) !== -1 || !val ||
          d.userName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.table.offset = 0;
  }


  getAlerts(typeOflist: any = '') {
    this.cancelAll();
    this.typeOflist = typeOflist;
    this.userService.getUserList(this.typeOflist).subscribe((Data: any) => {
      if (Data.success) {
        this.temp = [...Data['result']['userList']];
        this.rows = [...Data['result']['userList']];
        this.count = Data['result']['all_count'];
      } else {
        this.global.errorToastr(Data.message);
      }
    });
  }

  cancelAll() {
    this.selected = [];
    this.usersSelectCount = 0;
    this.searchValue = '';
  }

  setPage(pageInfo) {
    window.scrollTo(0, 150);
  }

}

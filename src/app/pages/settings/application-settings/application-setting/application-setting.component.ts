import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from '../../../../shared/services/global.service';
import { SettingService } from '../../../../shared/services/setting.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditReasonCategoryComponent } from '../add-edit-reason-category/add-edit-reason-category.component';

@Component({
  selector: 'app-application-setting',
  templateUrl: './application-setting.component.html',
  styleUrls: ['./application-setting.component.scss']
})
export class ApplicationSettingComponent implements OnInit {
  rows = [];
  temp = [];
  selected = [];
  loadingIndicator = true;
  limitRow: Number = environment.adminlimitRow;
  adminsSelectCount;
  count: any;
  deleteFlag = false;
  status = [
    { label: 'Inactive', value: '0' },
    { label: 'Active', value: '1' }];

  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    private router: Router,
    private settingService: SettingService,
    private spinner: NgxSpinnerService,
    public global: GlobalService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.deleteFlag = false;
    this.getAllReasonCategory();
  }

  getAllReasonCategory() {
    this.settingService.getAllReasonCategoryList()
      .subscribe(
        Data => {
          if (Data.success) {
            this.temp = [...Data['result']['reasonCategory']];
            this.rows = Data['result']['reasonCategory'];
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.global.errorToastr(Data.message);
          }
        });
  }

  onEdit(v) {
    console.log('v', v);
    const modelRef = this.modalService.open(AddEditReasonCategoryComponent, { centered: true, windowClass: 'catreason-popup', backdrop: 'static', keyboard: false, backdropClass: 'white' });
    const modelData = {};
    modelData["categoryName"] = v.categoryName;
    modelData["id"] = v.reasonCategory;
    modelData["isEdit"] = true;
    modelRef.componentInstance.fromParent = modelData;
    modelRef.result.then((result) => {
      if (result) {
        this.getAllReasonCategory();
      }
    })
  }

  cancelAll() {
    // this.onSelect({ selected: [] });
    this.deleteFlag = false;
    this.selected = [];
    this.adminsSelectCount = 0;
  }

  setPage(pageInfo) {
    window.scrollTo(0, 150);
  }

  /**
   * Add new category
   */
  addNewCategory() {
    const modalRef = this.modalService.open(AddEditReasonCategoryComponent, { centered: true, windowClass: 'catreason-popup', backdrop: 'static', keyboard: false, backdropClass: 'white' });
    modalRef.result.then((result) => {
      if (result) {
        this.getAllReasonCategory();
      }
    });
  }

  /**
  * Change Status of reason
  * @param event 
  * @param row 
  */
  changeStatus(event, row) {
    const val = event.target.value;
    let Status = {};
    Status['status'] = val;
    Status['reasonCategory'] = row.reasonCategory
    // console.log('row', Status);
    this.settingService.changeReasonCategoryStatus(Status)
      .subscribe((res) => {
        if (res.success) {
          this.global.successToastr(res.message);
        } else {
          this.global.errorToastr(res.message);
        }
      });
  }

}

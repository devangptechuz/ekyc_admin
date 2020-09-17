import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from '../../../../shared/services/setting.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from '../../../../shared/services/global.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditCategoryComponent } from '../add-edit-sub-category/add-edit-category.component';


@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {
  rows = [];
  selected = [];
  loadingIndicator = true;
  limitRow: Number = environment.adminlimitRow;
  count: any;
  selectFlag = false;
  subCategoryData;
  modalRef: any;
  status = [
    { label: 'Inactive', value: '0' },
    { label: 'Active', value: '1' }];
  constructor(private router: Router,
    private settingService: SettingService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    public global: GlobalService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.selectFlag = false;
    this.subCategoryData = this.route.snapshot.data["category"];
    if (this.subCategoryData?.success) {
      this.rows = [...this.subCategoryData.result['subReasonCategoryList']]
    }
  }

  getSubReasonCategory() {
    this.settingService.getSubReasonCategory(this.route.snapshot.params.id)
      .subscribe((res) => {
        if (res.success) {
          this.rows = [...res.result['subReasonCategoryList']]
        } else {
          this.global.errorToastr(res.message);
        }
      });
  }


  changeStatus(event, row) {
    const val = event.target.value;
    let categoryStatus = {};
    categoryStatus['status'] = val;
    categoryStatus['id'] = row.id
    this.settingService.updateStatusReasonCategory(categoryStatus)
      .subscribe((res) => {
        if (res.success) {
          this.global.successToastr(res.message);
        } else {
          this.global.errorToastr(res.message);
        }
      });
  }

  // setRouterLink() {
  //   this.router.navigateByUrl('/settings/application-settings');
  // }

  addNewReason() {
    const modalRef = this.modalService.open(AddEditCategoryComponent, { centered: true, windowClass: 'catreason-popup', backdrop: 'static', keyboard: false, backdropClass: 'white' });
    modalRef.componentInstance.reasonId = this.route.snapshot.params.id;
    modalRef.result.then((result) => {
      if (result) {
        if (this.route.snapshot.params.id) {
          this.getSubReasonCategory();
        } else {
          this.getAllSubReasonCategory();
        }
      }
    });
  }

  onEdit(v) {
    const modelRef = this.modalService.open(AddEditCategoryComponent, { centered: true, windowClass: 'catreason-popup', backdrop: 'static', keyboard: false, backdropClass: 'white' });
    const modelData = {};
    modelData["reason"] = v.reason;
    modelData["reasonId"] = v.reasonId;
    modelData["id"] = v.id;
    modelData["isEdit"] = true;
    modelRef.componentInstance.fromParent = modelData;
    modelRef.result.then((result) => {
      if (result) {
        if (this.route.snapshot.params.id) {
          this.getSubReasonCategory();
        } else {
          this.getAllSubReasonCategory();
        }
      }
    })
  }

  /**
   * Get All Sub category of reason
   */
  getAllSubReasonCategory() {
    this.settingService.getSubReasonCategoryAll()
      .subscribe((res) => {
        if (res.success) {
          this.rows = [...res.result['subReasonCategoryList']]
        } else {
          this.global.errorToastr(res.message);
        }
      });
  }

}

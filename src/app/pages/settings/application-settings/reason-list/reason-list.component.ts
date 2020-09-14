import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from '../../../../shared/services/setting.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from '../../../../shared/services/global.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditCategoryComponent } from '../add-edit-category/add-edit-category.component';
import { AddEditReasonComponent } from '../add-edit-reason/add-edit-reason.component';


@Component({
  selector: 'app-reason-list',
  templateUrl: './reason-list.component.html',
  styleUrls: ['./reason-list.component.scss']
})
export class ReasonListComponent implements OnInit {
  rows = [];
  selected = [];
  loadingIndicator = true;
  limitRow: Number = environment.adminlimitRow;
  count: any;
  selectFlag = false;
  reasonData;
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
    this.reasonData = this.route.snapshot.data["reasons"];
    if (this.reasonData?.success) {
      this.rows = [...this.reasonData.result['reasonSubCategoryDetailList']]
    }
  }

  getReasonListBySubCategory() {
    this.settingService.getReasonListBySubCategory(this.route.snapshot.params.id)
      .subscribe((res) => {
        if (res.success) {
          this.rows = [...res.result['reasonSubCategoryDetailList']]
        } else {
          this.global.errorToastr(res.message);
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
    Status['id'] = row.id
    this.settingService.updateStatuSubReasonCategoryDetails(row.id, Status)
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
    console.log('this.route.snapshot.params.id', this.route.snapshot.params.id);
    const modalRef = this.modalService.open(AddEditReasonComponent, { centered: true, windowClass: 'catreason-popup', backdrop: 'static', keyboard: false, backdropClass: 'white' });
    modalRef.result.then((result) => {
      if (result) {
        if (this.route.snapshot.params.id) {
          this.getReasonListBySubCategory();
        } else {
          this.getAllReasonList();
        }
      }
    });
  }

  onEdit(v) {
    const modelRef = this.modalService.open(AddEditReasonComponent, { centered: true, windowClass: 'catreason-popup', backdrop: 'static', keyboard: false, backdropClass: 'white' });
    const modelData = {};
    modelData["reasonDescription"] = v.reasonDescription;
    modelData["reasonId"] = v.reasonId;
    modelData["subReasonId"] = v.subReasonId;
    modelData["id"] = v.id;
    modelData["isEdit"] = true;
    modelRef.componentInstance.fromParent = modelData;
    modelRef.result.then((result) => {
      if (result) {
        if (this.route.snapshot.params.id) {
          this.getReasonListBySubCategory();
        } else {
          this.getAllReasonList();
        }
      }
    })
  }

  /**
   * Get All Sub category of reason
   */
  getAllReasonList() {
    this.settingService.getAllReasonList()
      .subscribe((res) => {
        if (res.success) {
          this.rows = [...res.result['reasonSubCategoryDetailList']]
        } else {
          this.global.errorToastr(res.message);
        }
      });
  }

}

import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from '../../../../shared/services/setting.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from '../../../../shared/services/global.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditPromocodeComponent } from '../add-edit-promocode/add-edit-promocode.component';

@Component({
  selector: 'app-list-promocode',
  templateUrl: './list-promocode.component.html',
  styleUrls: ['./list-promocode.component.scss']
})
export class ListPromocodeComponent implements OnInit {
  rows = [];
  selected = [];
  loadingIndicator = true;
  limitRow: Number = environment.adminlimitRow;
  count: any;
  selectFlag = false;
  couponData;
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
    this.couponData = this.route.snapshot.data["couponList"];
    if (this.couponData?.success) {
      this.rows = [...this.couponData.result]
    }
  }

  /**
   * Change Status of Coupon
   * @param event 
   * @param row 
   */
  changeStatus(event, row) {
    const val = event.target.value;
    let Status = {};
    Status['status'] = val;
    Status['id'] = row.id
    this.settingService.updateStatuPromotionalCode(row.id, Status)
      .subscribe((res) => {
        if (res.success) {
          this.global.successToastr(res.message);
        } else {
          this.global.errorToastr(res.message);
        }
      });
  }

  addNewReason() {
    console.log('this.route.snapshot.params.id', this.route.snapshot.params.id);
    const modalRef = this.modalService.open(AddEditPromocodeComponent, { centered: true, windowClass: 'catreason-popup', backdrop: 'static', keyboard: false, backdropClass: 'white' });
    modalRef.result.then((result) => {
      if (result) {
        this.getAllPromotionalCodeList();
      }
    });
  }

  onEdit(v) {
    const modelRef = this.modalService.open(AddEditPromocodeComponent, { centered: true, windowClass: 'catreason-popup', backdrop: 'static', keyboard: false, backdropClass: 'white' });
    const modelData = {};
    modelData["name"] = v.name;
    modelData["id"] = v.id;
    modelData["code"] = v.code;
    modelData["expiry_date"] = v.expiryDate;
    modelData["status"] = v.status;
    modelData["isEdit"] = true;
    modelRef.componentInstance.fromParent = modelData;
    modelRef.result.then((result) => {
      if (result) {
        this.getAllPromotionalCodeList();
      }
    })
  }

  /**
   * Get All Sub category of reason
   */
  getAllPromotionalCodeList() {
    this.settingService.getAllPromotionalCodeList()
      .subscribe((res) => {
        if (res.success) {
          this.rows = [...res.result]
        } else {
          this.global.errorToastr(res.message);
        }
      });
  }

}

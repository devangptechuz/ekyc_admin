import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidationService } from '../../../../shared/services/validator.service';
import { SettingService } from '../../../../shared/services/setting.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-edit-segment-plan',
  templateUrl: './add-edit-brokerage-plan.component.html',
  styleUrls: ['./add-edit-brokerage-plan.component.scss']
})
export class AddEditBrokeragePlanComponent implements OnInit {
  @Input() title: string;
  @Input() fromParent: string;
  @Input() id: string;
  headerTitle = 'Add Brokerage Plan';
  segmentPlanForm: FormGroup;
  segmentsType = [];
  subSegmentsType = [];
  segmentCode = [];
  flag = true;
  segmentCodeLabel;

  constructor(private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private settingService: SettingService,
    public global: GlobalService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.fromParent) {
      this.headerTitle = 'Edit Brokerage Plan';
    }
    this.segmentPlanForm = this.formBuilder.group({
      plan_name: ['', [Validators.required]],
      category_id: [null, [Validators.required]],
      sub_category_id: [null, [Validators.required]],
      segmentCode: [null, [Validators.required]],
    });
    setTimeout(() => {
      this.getSegments();
      this.getSegmentCode();
    }, 500)
  }

  getSegments() {
    this.settingService.getSegmentCategory()
      .subscribe(
        Data => {
          if (Data.success) {
            this.segmentsType = [...Data['result']['Items']];
          } else {
            this.global.errorToastr(Data.message);
          }
          if (this.fromParent) {
            this.segmentPlanForm.controls.plan_name.setValue(this.fromParent['plan_name']);
            this.segmentPlanForm.controls.category_id.setValue(this.fromParent['category_id']);
            this.selectSegmentType(this.fromParent['category_id']);
          }
        });
  }

  getSegmentCode() {
    this.settingService.getBrokerageMasterList()
      .subscribe(
        Data => {
          if (Data.success) {
            this.segmentCode = [...Data['result']];
          } else {
            this.global.errorToastr(Data.message);
          }
          if (this.fromParent) {
            this.segmentPlanForm.controls.segmentCode.setValue(this.fromParent['segmentCode']);
            this.segmentCodeLabel = this.fromParent['segmentCode'];
          }
        });
  }

  selectSegmentType(e) {
    this.settingService.getSegmentSubCategory(e).subscribe(
      Data => {
        if (Data.success) {
          this.subSegmentsType = Data['result']['segmentSubCategoryList'];
          this.setSegmentDropdown(this.subSegmentsType);
        } else {
          this.global.errorToastr(Data.message);
        }
      });
  }

  selectBrokerageCode(e) {
    this.segmentCodeLabel = e;
  }

  setSegmentDropdown(segmentData) {
    this.segmentPlanForm.controls.sub_category_id.setValue([]);
    if (this.fromParent && this.flag) {
      this.segmentPlanForm.controls.sub_category_id.setValue(this.fromParent['sub_category_id']);
      this.flag = false;
    }
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    if (!this.segmentPlanForm.valid) {
      this.validationService.validateAllFormFields(this.segmentPlanForm);
      return false;
    }
    if (this.fromParent) {
      this.settingService.updateSegmentPlans(this.fromParent['id'], this.segmentPlanForm.value).subscribe(
        (result: any) => {
          if (result.success) {
            this.global.successToastr(result.message);
            this.segmentPlanForm.reset();
          } else {
            this.global.errorToastr(result.message);
          }
          this.activeModal.close(true);
        });
    } else {
      this.settingService.addSegmentPlans(this.segmentPlanForm.value).subscribe(
        (result: any) => {
          if (result.success) {
            this.global.successToastr(result.message);
            this.segmentPlanForm.reset();
          } else {
            this.global.errorToastr(result.message);
          }
          this.activeModal.close(true);
        });
    }
  }

}

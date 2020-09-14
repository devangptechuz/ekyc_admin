import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidationService } from '../../../../shared/services/validator.service';
import { SettingService } from '../../../../shared/services/setting.service';
import { GlobalService } from '../../../../shared/services/global.service';

@Component({
  selector: 'app-add-edit-reason',
  templateUrl: './add-edit-reason.component.html',
  styleUrls: ['./add-edit-reason.component.scss']
})
export class AddEditReasonComponent implements OnInit {
  @Input() title: string;
  @Input() fromParent: string;

  headerTitle = 'Add Reason';
  addEditReasonForm: FormGroup;
  categories = [];
  subCategories = [];
  selected;

  constructor(private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private settingService: SettingService,
    public global: GlobalService) { }

  async ngOnInit() {
    if (this.fromParent) {
      this.headerTitle = 'Edit Reason';
    }
    this.addEditReasonForm = this.formBuilder.group({
      reasonDescription: ['', [Validators.required]],
      reasonId: [null, [Validators.required]],
      subReasonId: [null, [Validators.required]],
    });
    setTimeout(() => {
      this.getReasons();
      this.getSubCategoryReasons();
    }, 500)

  }

  getReasons() {
    this.settingService.getReasonCategory()
      .subscribe(
        Data => {
          if (Data.success) {
            this.categories = [...Data['result']['reasonCategory']];
          } else {
            this.global.errorToastr(Data.message);
          }
          if (this.fromParent) {
            this.addEditReasonForm.controls.reasonDescription.setValue(this.fromParent['reasonDescription']);
            this.addEditReasonForm.controls.reasonId.setValue(this.fromParent['reasonId']);
            this.addEditReasonForm.controls.subReasonId.setValue(this.fromParent['subReasonId']);
            this.headerTitle = 'Edit Reason';
            this.selectMainCategoryType(this.fromParent['reasonId']);
          }
        });
  }

  /**
   * Get Sub Category Reasons
   */
  getSubCategoryReasons() {
    this.settingService.getSubReasonCategoryAll()
      .subscribe(
        Data => {
          if (Data.success) {
            this.subCategories = [...Data['result']['subReasonCategoryList']];
          } else {
            this.global.errorToastr(Data.message);
          }
          if (this.fromParent) {
            this.addEditReasonForm.controls.subReasonId.setValue(this.fromParent['subReasonId'])
          }
        });
  }

  selectMainCategoryType(e) {
    this.settingService.getSubReasonCategory(e)
      .subscribe((res) => {
        if (res.success) {
          this.subCategories = [...res.result['subReasonCategoryList']];
          this.setSubCategoryDropdown(this.subCategories);
        } else {
          this.global.errorToastr(res.message);
        }
      });
  }

  setSubCategoryDropdown(subCategories) {
    this.addEditReasonForm.controls.subReasonId.setValue([]);
    if (this.fromParent) {
      this.addEditReasonForm.controls.subReasonId.setValue(this.fromParent['subReasonId'])
    }
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    if (!this.addEditReasonForm.valid) {
      this.validationService.validateAllFormFields(this.addEditReasonForm);
      return false;
    }
    if (this.fromParent) {
      // this.addEditReasonForm.value.id = this.fromParent['id'];
      this.settingService.updateReason(this.fromParent['id'], this.addEditReasonForm.value).subscribe(
        (result: any) => {
          if (result.success) {
            this.global.successToastr(result.message);
            this.addEditReasonForm.reset();
          } else {
            this.global.errorToastr(result.message);
          }
          this.activeModal.close(true);
        });
    } else {
      this.settingService.addReason(this.addEditReasonForm.value).subscribe(
        (result: any) => {
          if (result.success) {
            this.global.successToastr(result.message);
            this.addEditReasonForm.reset();
          } else {
            this.global.errorToastr(result.message);
          }
          this.activeModal.close(true);
        });
    }
  }

  onSubmit() {

  }


  public dismiss() {
    this.activeModal.dismiss();
  }

}

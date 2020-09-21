import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidationService } from '../../../../shared/services/validator.service';
import { SettingService } from '../../../../shared/services/setting.service';
import { GlobalService } from '../../../../shared/services/global.service';

@Component({
  selector: 'app-add-edit-reason-category',
  templateUrl: './add-edit-reason-category.component.html',
  styleUrls: ['./add-edit-reason-category.component.scss']
})
export class AddEditReasonCategoryComponent implements OnInit {
  @Input() title: string;
  @Input() fromParent: string;
  headerTitle = 'Add Category Reason';
  categoryForm: FormGroup;
  categories = [];
  selected;

  constructor(private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private settingService: SettingService,
    public global: GlobalService) { }

  async ngOnInit() {
    this.categoryForm = this.formBuilder.group({
      reasonCategory: ['', [Validators.required]],
    });
    if (this.fromParent) {
      this.headerTitle = 'Edit Category Reason';
      this.categoryForm.controls.reasonCategory.setValue(this.fromParent['reasonCategory'])
    }
  }


  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    if (!this.categoryForm.valid) {
      this.validationService.validateAllFormFields(this.categoryForm);
      return false;
    }
    if (this.fromParent) {
      this.categoryForm.value.id = this.fromParent['id'];
      this.settingService.updateReasonCategory(this.fromParent['id'], this.categoryForm.value).subscribe(
        (result: any) => {
          if (result.success) {
            this.global.successToastr(result.message);
            this.categoryForm.reset();
          } else {
            this.global.errorToastr(result.message);
          }
          this.activeModal.close(true);
        });
    } else {
      this.settingService.addReasonCategory(this.categoryForm.value).subscribe(
        (result: any) => {
          if (result.success) {
            this.global.successToastr(result.message);
            this.categoryForm.reset();
          } else {
            this.global.errorToastr(result.message);
          }
          this.activeModal.close(true);
        });
    }
  }

  onSubmit() { }

  public dismiss() {
    this.activeModal.dismiss();
  }
}

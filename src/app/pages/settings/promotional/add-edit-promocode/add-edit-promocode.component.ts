import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidationService } from '../../../../shared/services/validator.service';
import { SettingService } from '../../../../shared/services/setting.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { NgbModal, NgbDatepicker, NgbCalendar, NgbDatepickerConfig, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'app/shared/datepicker-adapter/customeAdapter';

@Component({
  selector: 'app-add-edit-promocode',
  templateUrl: './add-edit-promocode.component.html',
  styleUrls: ['./add-edit-promocode.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class AddEditPromocodeComponent implements OnInit {
  @Input() title: string;
  @Input() fromParent: string;
  @ViewChild('dp') dp: NgbDatepicker;

  headerTitle = 'Add Promotional Code';
  addEditPromotionalForm: FormGroup;
  categories = [];
  subCategories = [];
  selected;
  statusArray = [{ 'id': 1, 'label': 'Active' }, { 'id': 0, 'label': 'Inactive' }];

  constructor(private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private settingService: SettingService,
    config: NgbDatepickerConfig,
    public global: GlobalService) {
    const currentDate = new Date();

    config.minDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    // config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  async ngOnInit() {
    if (this.fromParent) {
      this.headerTitle = 'Edit Promotional Code';
    }
    this.addEditPromotionalForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      expiry_date: ['', [Validators.required]],
      status: [null, [Validators.required]]
    });
    setTimeout(() => {
      this.getReasons();
    }, 500)

  }

  getReasons() {
    if (this.fromParent) {
      console.log('this.fromParent', this.fromParent);
      this.addEditPromotionalForm.controls.name.setValue(this.fromParent['name']);
      this.addEditPromotionalForm.controls.code.setValue(this.fromParent['code']);
      this.addEditPromotionalForm.controls.expiry_date.setValue(this.fromParent['expiry_date']);
      this.addEditPromotionalForm.controls.status.setValue(this.fromParent['status']);
      this.headerTitle = 'Edit Promotional Code';
    }
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    if (!this.addEditPromotionalForm.valid) {
      this.validationService.validateAllFormFields(this.addEditPromotionalForm);
      return false;
    }
    if (this.fromParent) {
      // this.addEditPromotionalForm.value.id = this.fromParent['id'];
      this.settingService.updatePromotionalCode(this.fromParent['id'], this.addEditPromotionalForm.value).subscribe(
        (result: any) => {
          if (result.success) {
            this.global.successToastr(result.message);
            this.addEditPromotionalForm.reset();
          } else {
            this.global.errorToastr(result.message);
          }
          this.activeModal.close(true);
        });
    } else {
      this.settingService.addPromotionalCode(this.addEditPromotionalForm.value).subscribe(
        (result: any) => {
          if (result.success) {
            this.global.successToastr(result.message);
            this.addEditPromotionalForm.reset();
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

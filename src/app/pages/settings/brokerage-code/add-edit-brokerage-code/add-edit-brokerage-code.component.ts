import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ValidationService} from '../../../../shared/services/validator.service';
import {SettingService} from '../../../../shared/services/setting.service';
import {GlobalService} from '../../../../shared/services/global.service';

@Component({
  selector: 'app-add-edit-brokerage-code',
  templateUrl: './add-edit-brokerage-code.component.html',
  styleUrls: ['./add-edit-brokerage-code.component.scss']
})
export class AddEditBrokerageCodeComponent implements OnInit {
  @Input() title: string;
  @Input() fromParent: string;
  headerTitle = 'Add Brokerage Code';
  brokerageCodeForm: FormGroup;
  selected;

  constructor(private activeModal: NgbActiveModal,
              private formBuilder: FormBuilder,
              private validationService: ValidationService,
              private settingService:SettingService,
              public global: GlobalService) { }

  ngOnInit(): void {
    this.brokerageCodeForm = this.formBuilder.group({
      segmentCode: ['', [Validators.required]],
      segmentCodeDescription: ['', [Validators.required]],
      segmentCodeName: ['', [Validators.required]],
      segmentCodeType: ['', [Validators.required]],
    });
    if(this.fromParent){
      this.brokerageCodeForm.controls.segmentCode.setValue(this.fromParent['segmentCode'])
      this.brokerageCodeForm.controls.segmentCodeDescription.setValue(this.fromParent['segmentCodeDescription'])
      this.brokerageCodeForm.controls.segmentCodeName.setValue(this.fromParent['segmentCodeName'])
      this.brokerageCodeForm.controls.segmentCodeType.setValue(this.fromParent['segmentCodeType'])
      this.headerTitle = 'Edit Segment Type';
    }
  }

  public decline() {
    this.activeModal.close(false);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  public accept() {
    if (!this.brokerageCodeForm.valid) {
      this.validationService.validateAllFormFields(this.brokerageCodeForm);
      return false;
    }
    if(this.fromParent){
      // this.segmentForm.value.id = this.fromParent['id'];
      this.settingService.updateBrokerageMaster(this.fromParent['id'],this.brokerageCodeForm.value).subscribe(
          (result: any) => {
            if (result.success) {
              this.global.successToastr(result.message);
              this.brokerageCodeForm.reset();
            } else {
              this.global.errorToastr(result.message);
            }
            this.activeModal.close(true);
          });
    } else {
      this.settingService.addBrokerageMaster(this.brokerageCodeForm.value).subscribe(
          (result: any) => {
            if (result.success) {
              this.global.successToastr(result.message);
              this.brokerageCodeForm.reset();
            } else {
              this.global.errorToastr(result.message);
            }
            this.activeModal.close(true);
          });
    }
  }

}

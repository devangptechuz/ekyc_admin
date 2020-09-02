import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ValidationService} from '../../../shared/services/validator.service';
import {SettingService} from '../../../shared/services/setting.service';
import {GlobalService} from '../../../shared/services/global.service';

@Component({
  selector: 'app-add-edit-segment',
  templateUrl: './add-edit-segment.component.html',
  styleUrls: ['./add-edit-segment.component.scss']
})
export class AddEditSegmentComponent implements OnInit {
  @Input() title: string;
  @Input() fromParent: string;
  headerTitle = 'Add Segment Type';
  segmentForm: FormGroup;
  selected;

  constructor(private activeModal: NgbActiveModal,
              private formBuilder: FormBuilder,
              private validationService: ValidationService,
              private settingService:SettingService,
              public global: GlobalService) { }

  ngOnInit(): void {
    this.segmentForm = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
    if(this.fromParent){
      this.segmentForm.controls.name.setValue(this.fromParent['name'])
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
    if (!this.segmentForm.valid) {
      this.validationService.validateAllFormFields(this.segmentForm);
      return false;
    }
    if(this.fromParent){
      // this.segmentForm.value.id = this.fromParent['id'];
      this.settingService.updateSegmentCategory(this.fromParent['id'],this.segmentForm.value).subscribe(
          (result: any) => {
            if (result.success) {
              this.global.successToastr(result.message);
              this.segmentForm.reset();
            } else {
              this.global.errorToastr(result.message);
            }
            this.activeModal.close(true);
          });
    } else {
      this.settingService.addSegmentCategory(this.segmentForm.value).subscribe(
          (result: any) => {
            if (result.success) {
              this.global.successToastr(result.message);
              this.segmentForm.reset();
            } else {
              this.global.errorToastr(result.message);
            }
            this.activeModal.close(true);
          });
    }
  }

}

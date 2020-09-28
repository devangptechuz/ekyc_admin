import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { SettingService } from '../../services/setting.service';
import { ValidationService } from 'app/shared/services/validator.service';

@Component({
  selector: 'app-edit-email-model',
  templateUrl: './edit-email-model.component.html'
})
export class EditEmailModelComponent implements OnInit {
  @Input() objectOfModal: any;

  emailForm: FormGroup;
  listOfReminderList: any;
  constructor(
    public fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private activeModal: NgbActiveModal,
    private settingService: SettingService,
    public global: GlobalService,
    private validate: ValidationService
  ) { }

  ngOnInit() {
    this.emailForm = this.fb.group({
      email: [this.objectOfModal['email'], [Validators.required]],
    });
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    if (!this.emailForm.valid) {
      this.validate.validateAllFormFields(this.emailForm);
      return false;
    }
    let obj = {};
    obj['email'] = this.emailForm.value.email;
    // obj['userId'] = this.objectOfModal['userId'];
    // console.log('obj', obj);
    this.settingService.updateEmail(obj, this.objectOfModal['userId'])
      .subscribe((res) => {
        if (res.success) {
          this.global.successToastr(res.message);
        } else {
          this.global.errorToastr(res.message);
        }
      });
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}

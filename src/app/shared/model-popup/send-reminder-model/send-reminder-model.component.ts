import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { UserService } from '../../services/user.service';
import { SettingService } from '../../services/setting.service';
import { SharedService } from 'app/shared/services/shared.service';

@Component({
  selector: 'app-send-reminder-model',
  templateUrl: './send-reminder-model.component.html'
})
export class sendReminderModelComponent implements OnInit {
  @Input() objectOfModal: any;

  reminderForm: FormGroup;
  listOfReminderList: any;
  reasonList = [];
  listOfTypeReminder = [];
  constructor(
    public fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private activeModal: NgbActiveModal,
    private settingService: SettingService,
    public global: GlobalService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.reminderForm = this.fb.group({
      emailReminder: '',
      smsReminder: '',
      typeByReminder: ['', [Validators.required]]
    });
    this.listOfReminderList = [
      { name: 'emailReminder', value: 'email_alert', label: 'Email' },
      { name: 'smsReminder', value: 'mobile_alert', label: 'SMS' }
    ];

    this.listOfTypeReminder = [
      { name: 'verifyEmailReminder', value: 'verifyEmailReminder', label: 'Verify Email Reminder' },
      { name: 'completeAppReminder', value: 'completeAppReminder', label: 'Complete Application Reminder' },
      { name: 'correctAppReminder', value: 'correctAppReminder', label: 'Correct Application Reminder' }
    ];

    this.reasonList = this.objectOfModal['reasonArray'];
    console.log('this.reasonList', this.reasonList);
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    if (!this.reminderForm.value.emailReminder && !this.reminderForm.value.smsReminder) {
      this.global.errorToastr('Please select reminder options');
      return;
    }
    if (!this.reminderForm.valid) {
      this.global.errorToastr('Please choose type of reminder');
      return;
    }
    let obj = {};
    obj = this.reminderForm.value;
    if (!this.reasonList?.length && this.reminderForm.value.typeByReminder === 'correctAppReminder') {
      this.global.errorToastr('Please select the reasons');
      return;
    }
    if (this.reasonList.length) {
      obj['reasonList'] = this.reasonList;
    }
    this.settingService.sendReminder(obj)
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

  removeFromReasonList(id: string | number) {
    const reasonList = this.reasonList;
    const data = reasonList.filter((ele) => ele.subreasonId !== id);
    this.reasonList = data;
  }

}

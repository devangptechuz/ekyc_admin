import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { UserService } from '../../services/user.service';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'app-send-reminder-model',
  templateUrl: './send-reminder-model.component.html'
})
export class sendReminderModelComponent implements OnInit {
  @Input() objectOfModal: any;

  reminderForm: FormGroup;
  listOfReminderList: any;
  constructor(
    public fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private activeModal: NgbActiveModal,
    private settingService: SettingService,
    public global: GlobalService
  ) { }

  ngOnInit() {
    this.reminderForm = this.fb.group({
      typeOfReminder: new FormControl('', [Validators.required]),
    });
    this.listOfReminderList = [
      { value: 'email_alert', label: 'Email Alert' },
      { value: 'via_mobile_number', label: 'Text message on mobile number' },
      { value: 'application_incomplete', label: 'Application incomplete' }
    ];

  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    let obj = {};
    obj['typeOfReminder'] = this.reminderForm.value.typeOfReminder;
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

}

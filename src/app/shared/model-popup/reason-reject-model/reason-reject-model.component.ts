import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { UserService } from '../../services/user.service';
import { SettingService } from '../../services/setting.service';
import { SharedService } from 'app/shared/services/shared.service';

@Component({
  selector: 'app-reason-reject-model',
  templateUrl: './reason-reject-model.component.html'
})
export class ReasonRejectModelComponent implements OnInit {
  @Input() objectOfModal: any;

  listOfReasons: any[] = [];
  getReasonArray: FormArray;
  reasonDetailsform: FormGroup;
  reasonId: any;
  selectedReasonsArray: any[];
  favReasonsError: boolean = true;
  constructor(
    public fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private activeModal: NgbActiveModal,
    private settingService: SettingService,
    public global: GlobalService,
    private userService: UserService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    console.log('this.objectOfModal.name', this.objectOfModal);
    this.reasonDetailsform = this.fb.group({
      reasonsArray: this.fb.array([]),
      reason: ''
    });
    setTimeout(() => {
      this.settingService.getSubReasonListByReason({ reason: this.objectOfModal.name }).subscribe((res: any) => {
        if (res.success) {
          this.listOfReasons = res.result.listSubReason;
          this.reasonId = this.listOfReasons[0].reasonId
          this.listOfReasons.map(element => {
            this.addReasonControls(element);
          });
        }
      });
    }, 200);
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  addReasonControls(value): void {
    this.getReasonArray = this.reasonDetailsform.get('reasonsArray') as FormArray;
    this.getReasonArray.push(this.createItem(value));
  }

  createItem(value): FormGroup {
    return this.fb.group({
      name: false,
      id: value.id,
      reason: value.reason,
    });
  }

  selectReason($event) {
    setTimeout(() => {
      this.selectedReasonsArray = [];
      const getReasonArray: any = this.reasonDetailsform.get('reasonsArray') as FormArray;
      getReasonArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value.name) {
          // this.selectedReasonsArray.push(ctrl.value.id);
          this.selectedReasonsArray.push({ id: ctrl.value.id, reason: ctrl.value.reason });
        }
      });
      this.favReasonsError = this.selectedReasonsArray?.length <= 0;
    }, 200);
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    let paramObj;
    let obj = [];
    if (this.selectedReasonsArray?.length) {
      this.selectedReasonsArray.map((item) => {
        item['reasonId'] = this.reasonId;
        obj.push(item);
      });
    }

    if (this.reasonDetailsform.value.reason) {
      let obj1 = [];
      obj1.push({ 'reasonDetail': this.reasonDetailsform.value.reason, 'reasonId': '8', 'reason': this.reasonDetailsform.value.reason });
      if (obj.length) {
        paramObj = [...obj, ...obj1];
      } else {
        paramObj = obj1;
      }
    } else {
      paramObj = obj;
    }
    // console.log('paramObj--', paramObj);
    const reasonArray = paramObj;
    const reasonParam = [];
    if (reasonArray.length) {
      reasonArray.map((item) => {
        if (!item['id']) {
          reasonParam.push({ 'reasonDetail': item['reasonDetail'], 'reasonId': item['reasonId'] });
        } else {
          reasonParam.push({ 'subReasonId': item['id'], 'reasonId': item['reasonId'] });
        }
      });
    }
    const sendData = {};
    sendData['userId'] = this.objectOfModal.userId;
    sendData['paramObj'] = reasonParam;
    if (this.objectOfModal.name !== 'Reject Reason') {
      this.settingService.saveRequestReview(sendData)
        .subscribe((res) => {
          if (res.success) {
            this.global.successToastr(res.message);
            this.activeModal.close(true);
          } else {
            this.global.errorToastr(res.message);
            this.activeModal.close(true);
          }
        }, (error) => {
          this.activeModal.close(true);
        });
    } else {
      this.settingService.sendReasonInfo(sendData)
        .subscribe((res) => {
          if (res.success) {
            // this.global.successToastr(res.message);
            this.activeModal.close(true);
          } else {
            this.global.errorToastr(res.message);
            this.activeModal.close(true);
          }
        }, (error) => {
          this.activeModal.close(true);
        });
    }
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}

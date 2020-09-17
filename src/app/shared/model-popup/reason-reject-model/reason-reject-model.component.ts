import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { UserService } from '../../services/user.service';
import { SettingService } from '../../services/setting.service';

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
  ) { }

  ngOnInit() {
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
    });
  }

  selectReason($event) {
    setTimeout(() => {
      this.selectedReasonsArray = [];
      const getReasonArray: any = this.reasonDetailsform.get('reasonsArray') as FormArray;
      getReasonArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value.name) {
          this.selectedReasonsArray.push(ctrl.value.id);
        }
      });
      this.favReasonsError = this.selectedReasonsArray?.length <= 0;
    }, 200);
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    let obj = [];
    let paramObj;
    // console.log('this.selectedReasonsArray.length', this.selectedReasonsArray);
    if (this.selectedReasonsArray.length) {
      this.selectedReasonsArray.map((item) => {
        obj.push({ 'userId': this.objectOfModal.userId, 'reasonId': this.reasonId, 'subReasonId': item });
      });
    }
    // console.log('this.selectedReasonsArray.length', obj); return;
    // obj['subReasonId'] = [...this.selectedReasonsArray];
    if (this.reasonDetailsform.value.reason) {
      let obj1 = [];
      obj1.push({ 'userId': this.objectOfModal.userId, 'reasonDetail': this.reasonDetailsform.value.reason, 'reasonId': '8' });
      paramObj = [...obj, ...obj1];
    } else {
      paramObj = obj;
    }
    this.settingService.sendReasonInfo(paramObj)
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

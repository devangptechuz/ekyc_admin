import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'app/shared/services/admin.service';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-reason-reject-model',
  templateUrl: './reason-reject-model.component.html'
})
export class ReasonRejectModelComponent implements OnInit {
  @Input() objectOfModal: any;

  listOfReasons: any[] = [];
  getReasonArray: FormArray;
  reasonDetailsform: FormGroup;
  selectedReasonsArray: any[];
  favReasonsError: boolean = true;
  constructor(
    public fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private activeModal: NgbActiveModal,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.reasonDetailsform = this.fb.group({
      reasonsArray: this.fb.array([]),
      reason_not_listed: ''
    });
    setTimeout(() => {
      this.adminService.getTestAdmins().subscribe((res: any) => {
        console.log('res', res);
        if (res?.body?.success) {
          this.listOfReasons = res?.body?.result.userList;
          this.listOfReasons.map(element => {
            this.addReasonControls(element);
          });
        }
      });
    }, 500);
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

  /**
   * check account type countrol
   */
  checkAccountControlsTouched() {
    let flg = false;
    this.getReasonArray?.controls?.forEach((control) => {
      if (control.touched) {
        flg = true;
      }
    });
    return flg;
  }

  selectReason($event) {
    setTimeout(() => {
      this.selectedReasonsArray = [];
      const getReasonArray: any = this.reasonDetailsform.get('reasonsArray') as FormArray;
      getReasonArray.controls.forEach((ctrl: FormControl, i) => {
        if (ctrl.value.name) {
          this.selectedReasonsArray.push(ctrl.value.id);
        }
      });
      console.log('reasonsArray', this.selectedReasonsArray);
      this.favReasonsError = this.selectedReasonsArray?.length > 0 ? false : true;
    }, 500);
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}

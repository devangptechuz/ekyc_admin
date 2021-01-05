import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { NgbDatepickerConfig, NgbModal, NgbDateAdapter, NgbDateParserFormatter, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from 'app/shared/services/global.service';
import { ValidationService } from 'app/shared/services/validator.service';
import { UserService } from 'app/shared/services/user.service';
import { CustomAdapter, CustomDateParserFormatter } from 'app/shared/datepicker-adapter/customeAdapter';

@Component({
  selector: 'app-nominee-details',
  templateUrl: './nominee-details.component.html',
  styleUrls: ['./nominee-details.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class NomineeDetailsComponent implements OnInit {
  @ViewChild('dp') dp: NgbDatepicker;
  userId: any;
  nomineeForm: FormGroup;
  countNominee = 1;
  items: FormArray;

  constructor(
    public fb: FormBuilder,
    private ref: ChangeDetectorRef,
    config: NgbDatepickerConfig,
    private router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private global: GlobalService,
    public validate: ValidationService,
    public userService: UserService,
  ) {
    const currentDate = new Date();
    config.minDate = { year: 1947, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params.id;
    this.setForm();
    this.getNominee();
  }


  /**
   * Initialize Form
   */
  setForm() {
    this.nomineeForm = this.fb.group({
      items: this.fb.array([this.createItem()])
    });
  }

  /**
   * Check for same as permenent
   */
  checkForSameAsPermenent(event, index) {
    const nomineeArrayItems = this.nomineeForm.get('items') as FormArray;
    if (event.target.value === 'yes') {
      const arrayFields = ['address_line1', 'address_line2', 'address_line3', 'pin_code', 'country'];
      nomineeArrayItems.controls.forEach((formItem, j) => {
        if (index === j) {
          arrayFields.map((item) => {
            formItem.get(item).clearValidators();
            formItem.get(item).updateValueAndValidity();
          });
        }
      });
    } else if (event.target.value === 'no') {
      const arrayFields = ['address_line1', 'address_line2', 'address_line3'];
      nomineeArrayItems.controls.forEach((formItem, j) => {
        if (index === j) {
          arrayFields.map((item) => {
            formItem.get(item).setValidators([Validators.required]);
            formItem.get(item).updateValueAndValidity();
          });
          formItem.get('pin_code').setValidators([Validators.required, this.validate.pincodeValidator]);
          formItem.get('pin_code').updateValueAndValidity();
          formItem.get('country').setValue('INDIA');
          formItem.get('country').setValidators([Validators.required]);
          formItem.get('country').updateValueAndValidity();
        }
      });
    }
  }

  /**
   * Create FormGroup in FormArray
   */
  createItem(): FormGroup {
    return this.fb.group({
      prefix_name: new FormControl('', [this.validate.required]),
      nominee_name: new FormControl('', [this.validate.required]),
      nominee_relation: new FormControl('', [this.validate.required]),
      nominee_identity_type: new FormControl('', [this.validate.required]),
      nominee_identity_number: new FormControl('', [this.validate.required]),
      nominee_dob: new FormControl('', [this.validate.required, this.validate.dobValidator]),
      nominee_mobile_number: new FormControl('', [this.validate.required, Validators.maxLength(10), this.validate.mobileNumberValidator]),
      is_same_as_user: new FormControl('yes'),
      address_line1: new FormControl(''),
      address_line2: new FormControl(''),
      address_line3: new FormControl(''),
      pin_code: new FormControl('', [Validators.maxLength(10)]),
      country: new FormControl('INDIA'),
    });
  }

  /**
   * add item dynamically
   */
  addItem(): void {
    if (this.countNominee < 3) {
      this.countNominee++;
      this.items = this.nomineeForm.get('items') as FormArray;
      this.items.push(this.createItem());
    } else {
      this.global.errorToastr('You can add max 3 nominees.');
    }
  }

  /**
   * Remove nominee using index
   * @param index 
   */
  RemoveItem(index: number) {
    if (this.countNominee > 1) {
      this.countNominee--;
      this.items.removeAt(index);
    }
  }

  /**
   * get nominee details
   */
  getNominee() {
    this.userService.getNominee(this.route.snapshot.params.id).subscribe((res) => {
      if (res.success) {
        const nomineeArrayItems = this.nomineeForm.get('items') as FormArray;
        if (!res.result.isNomineeSkiped) {
          res.result.nomineeInfo.map((item, i) => {
            nomineeArrayItems.at(i).patchValue({
              prefix_name: item.prefix_name,
              nominee_name: item.nominee_name,
              nominee_relation: item.nominee_relation,
              nominee_identity_type: item.nominee_identity_type,
              nominee_identity_number: item.nominee_identity_number,
              nominee_dob: item.nominee_dob,
              nominee_mobile_number: item.nominee_mobile_number
            });
            let isSameAsUserVar = 'yes';
            if (!item.is_same_as_user) {
              isSameAsUserVar = 'no';
            }
            nomineeArrayItems.at(i).patchValue({
              is_same_as_user: isSameAsUserVar
            });
            if (!item.is_same_as_user) {
              nomineeArrayItems.at(i).patchValue({
                address_line1: item.address_line1,
                address_line2: item.address_line2,
                address_line3: item.address_line3,
                pin_code: item.pin_code,
                country: item.country
              });
            }
          });
        }
      } else {
        this.global.errorToastr(res.message);
      }
    });
  }

  /**
   * save nominee details
   */
  onSubmit() {
    let objParams = { is_nominated: false };

    if (this.nomineeForm.invalid) {
      this.global.errorToastr('PLEASE_FILL_ALL_REQUIRED_FIELDS');
      return;
    }
    const nomineeData = this.nomineeForm.value;
    nomineeData.items.map((objData) => {
      if (objData.is_same_as_user === 'yes') {
        objData['is_same_as_user'] = true;
        delete objData.address_line1;
        delete objData.address_line2;
        delete objData.address_line3;
        delete objData.pin_code;
        delete objData.country;
      } else {
        objData['is_same_as_user'] = false;
      }
    });

    objParams['is_nominated'] = true;
    objParams['nomineeData'] = nomineeData.items;
    objParams['id'] = this.userId;

    // console.log('objParams', objParams);
    // return;
    this.userService.saveNomineeDetails(objParams).subscribe((res: any) => {
      if (res.success) {
        this.global.successToastr(res.message);
        this.router.navigate(['applications/details', this.userId]);
      } else {
        this.global.errorToastr(res.message);
      }
    });
  }


}

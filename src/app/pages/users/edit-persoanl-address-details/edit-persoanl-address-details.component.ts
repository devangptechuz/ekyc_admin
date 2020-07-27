import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'app/shared/services/validator.service';
import { UserService } from 'app/shared/services/user.service';
import { GlobalService } from 'app/shared/services/global.service';
import { NgbModal, NgbDatepicker, NgbCalendar, NgbDatepickerConfig, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'app/shared/datepicker-adapter/customeAdapter';


@Component({
  selector: 'app-edit-persoanl-address-details',
  templateUrl: './edit-persoanl-address-details.component.html',
  styleUrls: ['./edit-persoanl-address-details.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class EditPersoanlAddressDetailsComponent implements OnInit {
  @ViewChild('dp') dp: NgbDatepicker;
  userId: any;
  addressDetailsform: FormGroup;
  addAddress: boolean;
  gender = [{ value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }];
  countryList = [{ label: 'INDIA' }, { label: 'USA' }];
  maritalStatus = [
    { id: 'Unmarried', label: 'Unmarried' },
    { id: 'Married', label: 'Married' }]
  // { 'Unmarried': 'Unmarried', 'Married': 'Married' };
  OccupationTypeArray: any[];
  IncomeRangeArray: any[];
  corresAddress: any;
  constructor(
    public fb: FormBuilder,
    private router: Router,
    config: NgbDatepickerConfig,
    private route: ActivatedRoute,
    public validate: ValidationService,
    private userService: UserService,
    private global: GlobalService
  ) {
    const currentDate = new Date();

    config.minDate = { year: 1947, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params.id;

    const requiredFahterValidate = new FormControl('', [Validators.required]);
    const requiredMotherValidate = new FormControl('', [Validators.required]);
    const requiredSelection = ['', Validators.required];
    const requiredNullSelection = [null, Validators.required];
    this.addressDetailsform = this.fb.group({
      name: new FormControl(''),
      gender: requiredNullSelection,
      dob: new FormControl(''),
      marital_status: new FormControl(null),
      occupation_type: requiredNullSelection,
      income_range: requiredNullSelection,
      father_spouse_name: new FormControl(''),
      mother_name: new FormControl(''),
      address_line1: new FormControl(''),
      address_line2: new FormControl(''),
      address_line3: new FormControl(''),
      pin_code: requiredSelection,
      country: new FormControl(null),
      same_as: new FormControl(false),
      corres_address_line1: new FormControl(''),
      corres_address_line2: new FormControl(''),
      corres_address_line3: new FormControl(''),
      corres_pin_code: new FormControl(''),
      corres_country: new FormControl(null),
    });

    this.getAddressDetails(this.userId);
  }

  onSubmit() {
    if (!this.addressDetailsform.valid) {
      this.validate.validateAllFormFields(this.addressDetailsform);
      return false;
    }
    let obj = this.addressDetailsform.value;
    obj['id'] = this.userId;
    if (this.addressDetailsform.value.name) {
      obj['full_name'] = this.addressDetailsform.value.name;
      // obj['fullName'] = this.addressDetailsform.value.name;
    }

    // if (this.addressDetailsform.value.marital_status) {
    //   obj['marital_status'] = this.addressDetailsform.value.marital_status;
    // }
    if (this.addressDetailsform.value.dob) {
      obj['date_of_birth'] = this.addressDetailsform.value.dob;
    }
    if (this.addressDetailsform.value.address_line1) {
      obj['permanent_address_line1'] = this.addressDetailsform.value.address_line1;
    }
    if (this.addressDetailsform.value.address_line2) {
      obj['permanent_address_line2'] = this.addressDetailsform.value.address_line2;
    }
    if (this.addressDetailsform.value.address_line3) {
      obj['permanent_address_line3'] = this.addressDetailsform.value.address_line3;
    }
    if (this.addressDetailsform.value.pin_code) {
      obj['permanent_pin_code'] = this.addressDetailsform.value.pin_code;
    }
    if (this.addressDetailsform.value.country) {
      obj['permanent_country'] = this.addressDetailsform.value.country;
    }
    obj['same_as_parmanent'] = this.addressDetailsform.value.same_as;
    if (this.addressDetailsform.value.same_as) {
      // const arrayFields = ['corres_address_line1', 'corres_address_line2', 'corres_address_line3', 'corres_pin_code', 'corres_country'];
      delete obj.corres_address_line1;
      delete obj.corres_address_line2;
      delete obj.corres_address_line3;
      delete obj.corres_pin_code;
      delete obj.corres_country;
    }
    delete obj.name;
    delete obj.country;
    delete obj.dob;
    delete obj.address_line1;
    delete obj.address_line2;
    delete obj.address_line3;
    delete obj.pin_code;
    delete obj.same_as;

    // console.log('this.addressDetailsform', obj);
    this.userService.submitPersonalDetails(obj).subscribe((res: any) => {
      if (res.success) {
        this.global.successToastr(res.message);
        this.router.navigateByUrl('/applications/details/' + this.userId);
      } else {
        this.global.errorToastr(res.message);
      }
    });
  }
  /**
   * Get address details
   */
  getAddressDetails(userId) {
    this.userService.getPersonalAddressDetails(userId).subscribe((res) => {
      // console.log('res', res);
      if (res.success) {
        // this.verifiedSteps.isAadharVerified = true;
        if (res.result.full_name) {
          this.addressDetailsform.patchValue({ name: res.result.full_name });
        }
        if (res.result.gender) {
          this.addressDetailsform.patchValue({ gender: res.result.gender });
        }
        if (res.result.date_of_birth) {
          const dob = res.result.date_of_birth.replace(/-/g, "/");
          this.addressDetailsform.patchValue({ dob: dob });
        }
        if (res.result.marital_status) {
          this.addressDetailsform.patchValue({ marital_status: res.result.marital_status });
        }
        if (res.result.occupation_type) {
          this.addressDetailsform.patchValue({ occupation_type: res.result.occupation_type });
        }
        if (res.result.income_range) {
          this.addressDetailsform.patchValue({ income_range: res.result.income_range });
        }
        if (res.result.mother_name) {
          this.addressDetailsform.patchValue({ mother_name: res.result.mother_name });
        }
        if (res.result.father_name) {
          this.addressDetailsform.patchValue({ father_spouse_name: res.result.father_name });
        }
        if (res.result.incomes) {
          this.IncomeRangeArray = res.result.incomes;
        }
        if (res.result.occupations) {
          this.OccupationTypeArray = res.result.occupations;
        }

        if (res.result.permanent_address?.address_line1) {
          this.addressDetailsform.patchValue({ address_line1: res.result.permanent_address?.address_line1 });
        }
        if (res.result.permanent_address?.address_line2) {
          this.addressDetailsform.patchValue({ address_line2: res.result.permanent_address?.address_line2 });
        }
        if (res.result.permanent_address?.address_line3) {
          this.addressDetailsform.patchValue({ address_line3: res.result.permanent_address?.address_line3 });
        }
        if (res.result.permanent_address?.pin_code) {
          this.addressDetailsform.patchValue({ pin_code: res.result.permanent_address?.pin_code });
        }
        if (res.result.permanent_address?.country) {
          this.addressDetailsform.patchValue({ country: res.result.permanent_address?.country.toUpperCase() });
        }
        if (!res.result.is_corres_same_permanent) {
          this.addAddress = true;
          let country = '';
          if (res.result.corrospondence_address?.country) {
            country = res.result.corrospondence_address?.country?.toUpperCase()
          }
          if (res.result.corrospondence_address) {
            this.corresAddress = res.result.corrospondence_address;
          }
          this.addressDetailsform.patchValue({ same_as: false });
          this.addressDetailsform.patchValue({
            // same_as: false,
            corres_address_line1: res.result.corrospondence_address?.address_line1,
            corres_address_line2: res.result.corrospondence_address?.address_line2,
            corres_address_line3: res.result.corrospondence_address?.address_line3,
            corres_pin_code: res.result.corrospondence_address?.pin_code,
            corres_country: country,
          });
        } else {
          this.addressDetailsform.patchValue({ same_as: true });
        }

      } else {
        this.global.errorToastr(res.message);
      }
    });
  }

  /**
  * Check for same as permenent
  */
  checkForSameAsPermenent(event) {
    // console.log('event.target.checked', event.target.checked);
    if (event.target.checked) {
      this.addressDetailsform.get('same_as').setValue(true);
      this.addAddress = false;
      const arrayFields = ['corres_address_line1', 'corres_address_line2', 'corres_address_line3', 'corres_pin_code', 'corres_country'];
      arrayFields.map((item) => {
        // this.addressDetailsform.get(item).setValue('');
        this.addressDetailsform.get(item).clearValidators();
        this.addressDetailsform.get(item).updateValueAndValidity();
      });
    } else {
      this.addAddress = true;
      const arrayFields = ['corres_address_line1', 'corres_address_line2', 'corres_address_line3'];
      arrayFields.map((item) => {
        this.addressDetailsform.get(item).setValidators([Validators.required]);
        this.addressDetailsform.get(item).updateValueAndValidity();
      });
      this.addressDetailsform.get('corres_pin_code').setValidators([Validators.required, this.validate.pincodeValidator]);
      this.addressDetailsform.get('corres_pin_code').updateValueAndValidity();
      this.addressDetailsform.get('corres_country').setValidators([Validators.required]);
      this.addressDetailsform.get('corres_country').updateValueAndValidity();
      this.addressDetailsform.get('same_as').setValue(false);
    }
  }

  /**
  * Add correspondence address (required)
  */
  addCorrespondenceAddress() {
    this.addAddress = true;
    const requiredAddressLine1 = new FormControl('', [this.validate.required]);
    const requiredAddressLine2 = new FormControl('', [this.validate.required]);
    const requiredAddressLine3 = new FormControl('', [this.validate.required]);
    const requiredPINCode = ['', Validators.compose([Validators.required, this.validate.pincodeValidator])];
    this.addressDetailsform = this.fb.group({
      corres_address_line1: requiredAddressLine1,
      corres_address_line2: requiredAddressLine2,
      corres_address_line3: requiredAddressLine3,
      corres_pin_code: requiredPINCode,
      corres_country: new FormControl(null),
      same_as: new FormControl(false)
    });
    this.addressDetailsform.updateValueAndValidity();
  }

}

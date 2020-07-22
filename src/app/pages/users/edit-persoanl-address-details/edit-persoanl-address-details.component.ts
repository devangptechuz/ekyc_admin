import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'app/shared/services/validator.service';
import { UserService } from 'app/shared/services/user.service';
import { GlobalService } from 'app/shared/services/global.service';

@Component({
  selector: 'app-edit-persoanl-address-details',
  templateUrl: './edit-persoanl-address-details.component.html',
  styleUrls: ['./edit-persoanl-address-details.component.scss']
})
export class EditPersoanlAddressDetailsComponent implements OnInit {
  userId: any;
  addressDetailsform: FormGroup;
  addAddress: boolean;
  gender = [{ label: 'Male' }, { label: 'Female' }];
  countryList = [{ label: 'INDIA' }, { label: 'USA' }];
  maritalStatus = [
    { id: 'Unmarried', label: 'Unmarried' },
    { id: 'Married', label: 'Married' }]
  // { 'Unmarried': 'Unmarried', 'Married': 'Married' };
  OccupationTypeArray: any[];
  IncomeRangeArray: any[];
  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    public validate: ValidationService,
    private userService: UserService,
    private global: GlobalService
  ) { }

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
      marital_status: requiredNullSelection,
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
  }
  /**
   * Get address details
   */
  getAddressDetails(userId) {
    this.userService.getPersoanlAddressDetails(userId).subscribe((res) => {
      // console.log('res', res);
      if (res.success) {
        // this.verifiedSteps.isAadharVerified = true;
        if (res.result.full_name) {
          this.addressDetailsform.patchValue({ name: res.result.full_name });
        }
        if (res.result.gender) {
          this.addressDetailsform.patchValue({ gender: res.result.gender.toUpperCase() });
        }
        if (res.result.date_of_birth) {
          const dob = res.result.date_of_birth.replace(/-/g, "/");
          this.addressDetailsform.patchValue({ dob: dob });
        }
        if (res.result.marrital_status) {
          this.addressDetailsform.patchValue({ dob: res.result.marrital_status });
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
        if (res.result.father_spouse_name) {
          this.addressDetailsform.patchValue({ father_spouse_name: res.result.father_spouse_name });
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
    if (event.target.checked) {
      this.addressDetailsform.get('same_as').setValue(true);
      this.addAddress = false;
      const arrayFields = ['corres_address_line1', 'corres_address_line2', 'corres_address_line3', 'corres_pin_code', 'corres_country'];
      arrayFields.map((item) => {
        this.addressDetailsform.get(item).setValue('');
        this.addressDetailsform.get(item).clearValidators();
        this.addressDetailsform.get(item).updateValueAndValidity();
      });
    } else {
      this.addAddress = true;
      const requiredAddressLine1 = new FormControl('', [Validators.required]);
      const requiredAddressLine2 = new FormControl('', [Validators.required]);
      const requiredAddressLine3 = new FormControl('', [Validators.required]);
      const requiredPINCode = ['', Validators.compose([Validators.required, this.validate.pincodeValidator])];
      this.addressDetailsform = this.fb.group({
        corres_address_line1: requiredAddressLine1,
        corres_address_line2: requiredAddressLine2,
        corres_address_line3: requiredAddressLine3,
        corres_pin_code: requiredPINCode,
        corres_country: new FormControl(null),
        same_as: new FormControl(false)
      });
    }
    this.addressDetailsform.updateValueAndValidity();
  }

  /**
  * Add correspondence address (required)
  */
  addCorrespondenceAddress() {
    this.addAddress = true;
    const requiredAddressLine1 = new FormControl('', [ValidationService.required]);
    const requiredAddressLine2 = new FormControl('', [ValidationService.required]);
    const requiredAddressLine3 = new FormControl('', [ValidationService.required]);
    const requiredPINCode = ['', Validators.compose([Validators.required, this.validate.pincodeValidator])];
    this.addressDetailsform = this.fb.group({
      corres_address_line1: requiredAddressLine1,
      corres_address_line2: requiredAddressLine2,
      corres_address_line3: requiredAddressLine3,
      corres_pin_code: requiredPINCode,
      corres_country: new FormControl(null),
      same_as: new FormControl(false)
    });
  }

}

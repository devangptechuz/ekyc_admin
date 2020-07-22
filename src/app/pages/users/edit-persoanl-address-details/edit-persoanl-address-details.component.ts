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

    const requiredName = new FormControl('');
    const requiredFahterValidate = new FormControl('', [Validators.required]);
    const requiredMotherValidate = new FormControl('', [Validators.required]);
    const requiredSelection = ['', Validators.required];
    const requiredNullSelection = [null, Validators.required];
    this.addressDetailsform = this.fb.group({
      name: requiredSelection,
      gender: requiredNullSelection,
      dob: requiredSelection,
      marital_status: requiredNullSelection,
      occupation_type: requiredSelection,
      income_range: requiredSelection,
      father_spouse_name: requiredFahterValidate,
      mother_name: requiredMotherValidate,
      address_line1: requiredSelection,
      address_line2: requiredSelection,
      address_line3: requiredSelection,
      pin_code: requiredSelection,
      country: new FormControl('India'),
      same_as: new FormControl(false)
    });

    // this.getAddressDetails(this.userId);
  }

  onSubmit() {

  }
  /**
   * Get address details
   */
  getAddressDetails(userId) {
    this.userService.getPersoanlAddressDetails(userId).subscribe((res) => {
      // console.log('res', res);
      if (res.success) {
        // this.verifiedSteps.isAadharVerified = true;
        if (res.result.fullName) {
          this.addressDetailsform.patchValue({ name: res.result.fullName });
        }
        if (res.result.gender) {
          this.addressDetailsform.patchValue({ gender: res.result.gender.toUpperCase() });
        }
        if (res.result.dateOfBirth) {
          const dob = res.result.dateOfBirth.replace(/-/g, "/");
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

        if (res.result.address_line1) {
          this.addressDetailsform.patchValue({ address_line1: res.result.address_line1 });
        }
        if (res.result.address_line2) {
          this.addressDetailsform.patchValue({ address_line2: res.result.address_line2 });
        }
        if (res.result.address_line3) {
          this.addressDetailsform.patchValue({ address_line3: res.result.address_line3 });
        }
        if (res.result.pin_code) {
          this.addressDetailsform.patchValue({ pin_code: res.result.pin_code });
        }
        if (res.result.country) {
          this.addressDetailsform.patchValue({ country: res.result.country.toUpperCase() });
        }
        if (!res.result.is_corres_same_permanent) {
          this.addAddress = true;
          let country = '';
          if (res.result.userAddressData?.country) {
            country = res.result.userAddressData?.country?.toUpperCase()
          }
          this.addressDetailsform.patchValue({ same_as: false });
          this.addressDetailsform.patchValue({
            // same_as: false,
            address_line1: res.result.userAddressData?.address_line1,
            address_line2: res.result.userAddressData?.address_line2,
            address_line3: res.result.userAddressData?.address_line3,
            pin_code: res.result.userAddressData?.pin_code,
            country: country,
          });
        } else {
          this.addressDetailsform.patchValue({ same_as: true });
        }

      } else {
        this.global.errorToastr(res.message);
      }
    });
  }

}

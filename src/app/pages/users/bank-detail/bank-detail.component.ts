import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ValidationService } from 'app/shared/services/validator.service';
import { UserService } from 'app/shared/services/user.service';
import { GlobalService } from 'app/shared/services/global.service';
import { Constant } from 'app/shared/utils/constant';

@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.scss']
})
export class BankDetailComponent implements OnInit {
  userId: any;
  @ViewChild('mismatchcontent') misMatchModal: any;
  public bankDetailsform: FormGroup;
  bankAddress: any;
  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    public validate: ValidationService,
    public userService: UserService,
    public global: GlobalService,
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params.id;

    const requiredIFSCCode = new FormControl('', [this.validate.required]);
    const accountNumber = new FormControl('', [this.validate.required, this.validate.accountNumberValidator]);
    const requiredConfirmAccount = new FormControl('', [this.validate.required]);
    this.bankDetailsform = this.fb.group({
      IFSCCode: requiredIFSCCode,
      accountNumber: accountNumber,
      confirmAccountNumber: requiredConfirmAccount,
    },
      {
        validator: this.validate.MatchAccountNumber // your validation method
      }
    );

    this.getBankDetails(this.userId);
  }

  /**
   * get bank details using ifsc_code
   * @param ifsc_code 
   */
  searchBankDetails(ifsc_code: any) {
    const objParam = { 'ifsc_code': ifsc_code.toUpperCase() };
    this.userService.searchBankeDetails(objParam).subscribe((res: any) => {
      if (res.success) {
        this.bankAddress = res.result;
      } else {
        this.bankAddress = '';
        this.global.errorToastr(res.message);
      }
    });
  }


  passwordMatchValidator(bankDetailsform: FormGroup) {
    return bankDetailsform.controls['accountNumber'].value === bankDetailsform.controls['confirmAccountNumber'].value ? null : { 'mismatch': true };
  }

  getBankDetails(userId: string) {
    this.userService.getBankDetails(userId).subscribe((res: any) => {
      if (res.success) {
        if (res.result.ifsc_code) {
          this.bankDetailsform.patchValue({ IFSCCode: res.result.ifsc_code });
          const objParam = { 'ifsc_code': res.result.ifsc_code.toUpperCase() };
          this.userService.searchBankeDetails(objParam).subscribe((respo: any) => {
            if (respo.success) {
              this.bankAddress = respo.result;
            } else {
              this.bankAddress = '';
            }
          });
        }
        if (res.result.account_number) {
          this.bankDetailsform.patchValue({ accountNumber: res.result.account_number });
        }
        if (res.result.account_number) {
          this.bankDetailsform.patchValue({ confirmAccountNumber: res.result.account_number });
        }
      } else {
        this.global.errorToastr(res.message);
      }
    });
  }

  /**
  * Submit form
  */
  onSubmit() {
    if (!this.bankAddress) {
      this.global.errorToastr('IFSC code not exists')
    } else {
      if (this.bankDetailsform.valid) {
        let obj = {};
        obj['id'] = this.userId;
        obj['ifsc_code'] = this.bankDetailsform.value.IFSCCode.toUpperCase();
        obj['account_number'] = this.bankDetailsform.value.accountNumber;
        obj['confirm_account_number'] = this.bankDetailsform.value.confirmAccountNumber;
        this.userService.submitBankDetails(obj).subscribe((res: any) => {
          if (res.success) {
            this.global.successToastr(res.message);
            this.router.navigate(['applications/details', this.userId])
          } else {
            this.global.errorToastr(res.message);
          }
        });
      } else {
        this.validate.validateAllFormFields(this.bankDetailsform);
        this.global.errorToastr(Constant.PLEASE_FILL_ALL_REQUIRED_FIELDS);
      }
    }
  }

}

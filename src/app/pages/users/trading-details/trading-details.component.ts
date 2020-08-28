import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { ValidationService } from 'app/shared/services/validator.service';
import { UserService } from 'app/shared/services/user.service';
import { GlobalService } from 'app/shared/services/global.service';

@Component({
  selector: 'app-trading-details',
  templateUrl: './trading-details.component.html',
  styleUrls: ['./trading-details.component.scss']
})
export class TradingDetailsComponent implements OnInit {
  userId: any;
  trandingForm: FormGroup;
  /**************** STATIC FORM: START *****************/
  runningAccountAuthorizationArray = [{ id: 1, label: 'Once in a Quarter' }, { id: 2, label: 'Once in a Yearly' }];
  experienceInTradingArray = [{ id: 1, label: '1 Year' }, { id: 2, label: '2 Year' }, { id: 3, label: '3 Year' }];
  contractNoteDetailsArray = [{ value: 'ecn', label: 'ECN' }, { value: 'physical', label: 'Physical' }];
  tradingTypeArray = [{ value: 'Online', label: 'Online' }, { value: 'Offline', label: 'Offline' }, { value: 'Both', label: 'Both' }];
  mobileTradingArray = [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }];
  openDEMATAccountArray = [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }, { value: 'no_demat', label: 'No DEMAT' }];
  isDEMATExteranlArray = [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }];
  depositoryNameArray = [{ value: 'NSDL', label: 'NSDL' }, { value: 'CDSL', label: 'CDSL' }];
  SMSRequiredArray = [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }];
  receiveDISBookletArray = [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }];
  BSDAArray = [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }];
  POAArray = [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }];
  accountOpeningSchemeArray = [{ value: 'Free', label: 'Free' }, { value: 'Paid', label: 'Paid' }];
  statementFrequencyArray = [{ value: 'Weekly', label: 'Weekly' }, { value: 'Monthly', label: 'Monthly' }];
  /**************** STATIC FORM: END *****************/
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public validate: ValidationService,
    private userService: UserService,
    private global: GlobalService
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params.id;
    this.setFormValidation();
  }

  /**
   * Set and Initialize Form 
   */
  setFormValidation() {
    const requiredSelection = [false, Validators.required];
    this.trandingForm = this.fb.group({
      running_account_autorization: new FormControl('', [Validators.required]),
      experience_in_trading: new FormControl('', [Validators.required]),
      contract_note_details: new FormControl('ecn', [Validators.required]),
      trading_type: new FormControl('Online', [Validators.required]),
      mobile_trading: new FormControl('Yes', [Validators.required]),
      open_DEMAT_account: new FormControl('Yes', [Validators.required]),
      is_DEMAT_external: new FormControl('No', [Validators.required]),
      depository_name: new FormControl('NSDL', [Validators.required]),
      SMS_required: new FormControl('Yes', [Validators.required]),
      receive_DIS_booklet: new FormControl('Yes', [Validators.required]),
      BSDA: new FormControl('No', [Validators.required]),
      POA: new FormControl('Yes', [Validators.required]),
      account_opening_scheme: new FormControl('Free', [Validators.required]),
      statement_frequency: new FormControl('Weekly', [Validators.required])
    });
    this.getTradingDetails();
  }

  /**
   * Get Trading Details info
   */
  getTradingDetails() {
    this.userService.retriveTradingDetails(this.route.snapshot.params.id).subscribe((res: any) => {
      if (res.success) {
        this.trandingForm.patchValue({
          running_account_autorization: Number(res.result.running_account_autorization),
          experience_in_trading: Number(res.result.experience_in_trading),
          contract_note_details: res.result.contract_note_details,
          trading_type: res.result.trading_type,
          mobile_trading: res.result.mobile_trading,
          open_DEMAT_account: res.result.open_DEMAT_account,
          is_DEMAT_external: res.result.is_DEMAT_external,
          depository_name: res.result.depository_name,
          SMS_required: res.result.SMS_required,
          receive_DIS_booklet: res.result.receive_DIS_booklet,
          BSDA: res.result.BSDA,
          POA: res.result.POA,
          account_opening_scheme: res.result.account_opening_scheme,
          statement_frequency: res.result.statement_frequency
        });
      }
    });
  }

  /**
  * Submit form to get otp to reset password
  */
  onSubmit() {
    if (!this.trandingForm.valid) {
      this.global.errorToastr('PLEASE_FILL_ALL_REQUIRED_FIELDS');
    }
    if (this.trandingForm.value) {
      const obj = this.trandingForm.value;
      obj['id'] = this.userId;
      this.userService.saveTrandingDetails(obj).subscribe((res: any) => {
        if (res.success) {
          this.global.successToastr(res.message);
          this.router.navigateByUrl('/applications/details/' + this.userId);
        } else {
          this.global.errorToastr(res.message);
        }
      });
    }
  }

}

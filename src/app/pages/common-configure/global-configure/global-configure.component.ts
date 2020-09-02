import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from 'app/shared/services/validator.service';
import { UserService } from 'app/shared/services/user.service';
import { GlobalService } from 'app/shared/services/global.service';
import { GlobalConfigureService } from 'app/shared/services/global-configure.service';

@Component({
  selector: 'app-global-configure',
  templateUrl: './global-configure.component.html',
  styleUrls: ['./global-configure.component.scss']
})
export class GlobalConfigureComponent implements OnInit {
  kraForm: FormGroup;
  tokenInfoForm: FormGroup;
  sendGridInfoForm: FormGroup;
  smsInfoForm: FormGroup;
  digiLockerInfoForm: FormGroup;
  panInfoForm: FormGroup;
  commonInfoForm: FormGroup;
  razorPayInfoForm: FormGroup;

  getAllConfigurationList: any;
  kraInfoArray = [];
  tokenInfoArray = [];
  sendGridInfoArray = [];
  smsInfoArray = [];
  digiLockerInfoArray = [];
  panInfoArray = [];
  commonInfoArray = [];
  razorPayInfoArray = [];
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public validate: ValidationService,
    private userService: UserService,
    private global: GlobalService,
    private globalConfigureService: GlobalConfigureService
  ) {
  }

  ngOnInit(): void {
    this.getConfigureList();
  }

  getConfigureList() {
    this.globalConfigureService.getAllConfiguration().subscribe((res: any) => {
      if (res.success) {
        this.getAllConfigurationList = res.result;
        if (res?.result?.kraInfo) {
          this.kraInfoArray = res.result.kraInfo;
          this.kraValidation();
        }

        if (res?.result?.tokenInfo) {
          this.tokenInfoArray = res.result.tokenInfo;
          this.tokenInfoValidation();
        }

        if (res?.result?.sendGridInfo) {
          this.sendGridInfoArray = res.result.sendGridInfo;
          this.sendGridInfoValidation();
        }

        if (res?.result?.smsInfo) {
          this.smsInfoArray = res.result.smsInfo;
          this.smsInfoValidation();
        }

        if (res?.result?.digiLockerInfo) {
          this.digiLockerInfoArray = res.result.digiLockerInfo;
          this.digiLockerInfoValidation();
        }

        if (res?.result?.panInfo) {
          this.panInfoArray = res.result.panInfo;
          this.panInfoValidation();
        }

        if (res?.result?.commonInfo) {
          this.commonInfoArray = res.result.commonInfo;
          this.commonInfoValidation();
        }

        if (res?.result?.razorPayInfo) {
          this.razorPayInfoArray = res.result.razorPayInfo;
          this.razorPayInfoValidation();
        }
      }
    });
  }

  /**
   * KRA INFO Form Set/Validation
   */
  kraValidation() {
    this.kraForm = new FormGroup({});
    let group = {}
    this.kraInfoArray.forEach(input_template => {
      group[input_template.name] = new FormControl(input_template.value || '', [Validators.required]);
    })
    this.kraForm = new FormGroup(group);
  }

  /**
   * Token Info Form
   */
  tokenInfoValidation() {
    let group = {}
    this.tokenInfoArray.forEach(input_template => {
      group[input_template.name] = new FormControl(input_template.value || '', [Validators.required]);
    })
    this.tokenInfoForm = new FormGroup(group);
  }


  /**
   * SendGrid Info Validation Form
   */
  sendGridInfoValidation() {
    let group = {}
    this.sendGridInfoArray.forEach(input_template => {
      group[input_template.name] = new FormControl(input_template.value || '', [Validators.required]);
    })
    this.sendGridInfoForm = new FormGroup(group);
  }

  /**
   * KRA Form Submit
   */
  onKraFormSubmit() {
    if (this.kraForm.valid) {
      this.onSubmitCommon(this.kraForm.value);
    } else {
      this.global.errorToastr('Please fill all required fields');
    }
  }

  /**
   * Token Info save
   */
  onTokenSubmit() {
    if (this.tokenInfoForm.valid) {
      this.onSubmitCommon(this.tokenInfoForm.value);
    } else {
      this.global.errorToastr('Please fill all required fields');
    }
  }

  /**
   * sms Info Validation
   */
  smsInfoValidation() {
    let group = {}
    this.smsInfoArray.forEach(input_template => {
      group[input_template.name] = new FormControl(input_template.value || '', [Validators.required]);
    })
    this.smsInfoForm = new FormGroup(group);
  }

  onSmsInfoFormSubmit() {
    if (this.smsInfoForm.valid) {
      this.onSubmitCommon(this.smsInfoForm.value);
    } else {
      this.global.errorToastr('Please fill all required fields');
    }
  }

  /**
   * Digilocker Info Validation
   */
  digiLockerInfoValidation() {
    let group = {}
    this.digiLockerInfoArray.forEach(input_template => {
      group[input_template.name] = new FormControl(input_template.value || '', [Validators.required]);
    })
    this.digiLockerInfoForm = new FormGroup(group);
  }

  onDigiLockerInfoFormSubmit() {
    if (this.digiLockerInfoForm.valid) {
      this.onSubmitCommon(this.digiLockerInfoForm.value);
    } else {
      this.global.errorToastr('Please fill all required fields');
    }
  }

  /**
   * PAN Info Validation
   */
  panInfoValidation() {
    let group = {}
    this.panInfoArray.forEach(input_template => {
      group[input_template.name] = new FormControl(input_template.value || '', [Validators.required]);
    })
    this.panInfoForm = new FormGroup(group);
  }

  panInfoFormSubmit() {
    if (this.panInfoForm.valid) {
      this.onSubmitCommon(this.panInfoForm.value);
    } else {
      this.global.errorToastr('Please fill all required fields');
    }
  }

  /**
   * common Info Validation
   */
  commonInfoValidation() {
    let group = {}
    this.commonInfoArray.forEach(input_template => {
      group[input_template.name] = new FormControl(input_template.value || '', [Validators.required]);
    })
    this.commonInfoForm = new FormGroup(group);
  }

  commonInfoFormSubmit() {
    if (this.commonInfoForm.valid) {
      this.onSubmitCommon(this.commonInfoForm.value);
    } else {
      this.global.errorToastr('Please fill all required fields');
    }
  }

  /**
   * razorPay Info Validation
   */
  razorPayInfoValidation() {
    let group = {}
    this.razorPayInfoArray.forEach(input_template => {
      group[input_template.name] = new FormControl(input_template.value || '', [Validators.required]);
    })
    this.razorPayInfoForm = new FormGroup(group);
  }

  razorPayInfoFormSubmit() {
    if (this.razorPayInfoForm.valid) {
      this.onSubmitCommon(this.razorPayInfoForm.value);
    } else {
      this.global.errorToastr('Please fill all required fields');
    }
  }

  /**
   * Submit common 
   * @param formValue 
   */
  onSubmitCommon(formValue: any) {
    let sendData = formValue;
    let paramArray = [];
    Object.keys(sendData).map((item) => {
      paramArray.push({ 'name': item, 'value': sendData[item] })
    });
    const objParam = { requestData: paramArray }
    this.globalConfigureService.updateConfiguration(objParam).subscribe((res: any) => {
      if (res.success) {
        this.globalConfigureService.getAllConfigurationPromise(true);
        this.global.successToastr(res.message);
      }
    });
  }

  onSendGridSubmit() {
    if (this.sendGridInfoForm.valid) {
      this.onSubmitCommon(this.sendGridInfoForm.value);
    } else {
      this.global.errorToastr('Please fill all required fields');
    }
  }

}

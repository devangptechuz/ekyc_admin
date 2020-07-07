import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'app/shared/services/common.service';
import { ValidationService } from "app/shared/services/validator.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private toastr: ToastrService,
      private commonService: CommonService,
      private formBuilder: FormBuilder,
      private validationService: ValidationService,
      private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (!this.forgotPasswordForm.valid) {
      this.validationService.validateAllFormFields(this.forgotPasswordForm);
      return false;
    }
    this.commonService.forgotPassword(this.forgotPasswordForm.value).subscribe(
        (result: any) => {
          this.spinner.hide();
          this.forgotPasswordForm.reset();
        },
        error => {
          this.toastr.error(error.error);
        }
    );
  }

  onLogin(){
    this.router.navigateByUrl('/login');
  }

  onRegister(){

  }

}

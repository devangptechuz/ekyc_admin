import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'app/shared/services/common.service';
import { ValidationService } from "app/shared/services/validator.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.scss']
})
export class RegisterAdminComponent implements OnInit {
  toggleEyePassword = "ft-eye-off";
  toggleEyeConfirmPassword = "ft-eye-off";
  loginObj: any = {};
  loginForm: FormGroup;
  returnUrl: string;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private toastr: ToastrService,
      private commonService: CommonService,
      private formBuilder: FormBuilder,
      private validationService: ValidationService,
      private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirm_password: '',
    }, {
      validator: this.validationService.MatchPassword('password', 'confirm_password')
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      this.validationService.validateAllFormFields(this.loginForm);
      return false;
    }
    this.commonService.register(this.loginForm.value).subscribe(
        (result: any) => {
          this.router.navigateByUrl(this.returnUrl);
          this.spinner.hide();
          this.loginForm.reset();
        },
        error => {
          this.toastr.error(error.error);
        }
    );
  }

  togglePassword(event, oldPassword: any) {
    this.toggleEyePassword = this.toggleEyePassword == "ft-eye" ? "ft-eye-off" : "ft-eye";
    oldPassword.type = oldPassword.type === 'password' ? 'text' : 'password';
  }
  toggleConfirmPassword(event, oldPassword: any) {
    this.toggleEyeConfirmPassword = this.toggleEyeConfirmPassword == "ft-eye" ? "ft-eye-off" : "ft-eye";
    oldPassword.type = oldPassword.type === 'password' ? 'text' : 'password';
  }

}

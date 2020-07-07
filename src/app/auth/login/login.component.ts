import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'app/shared/services/common.service';
import { ValidationService } from "app/shared/services/validator.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent {
  toggleEye = "ft-eye-off";
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

  ngOnInit() {
    this.commonService.logout()
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.setLoginForm();
  }

  setLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      this.validationService.validateAllFormFields(this.loginForm);
      return false;
    }
    this.commonService.login(this.loginForm.value).subscribe(
      (result: any) => {
          if (result['status'] === true && result['data']) {
              localStorage.setItem('token', result['data'].token);
              localStorage.setItem('User', JSON.stringify(result['data'].Items[0]));
          }
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
    this.toggleEye = this.toggleEye == "ft-eye" ? "ft-eye-off" : "ft-eye";
    oldPassword.type = oldPassword.type === 'password' ? 'text' : 'password';
  }
}

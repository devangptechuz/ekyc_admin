import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'app/shared/services/common.service';
import { ValidationService } from "app/shared/services/validator.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from 'ngx-cookie-service';
import {GlobalService} from '../../shared/services/global.service';

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
    private spinner: NgxSpinnerService,
    private cookieService: CookieService,
    public global: GlobalService
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
    this.commonService.login(this.loginForm.value).subscribe((res: any) => {
      if(res.success){
          this.cookieService.set('admin_user_email',res.result.email);
          this.cookieService.set('admin_user_token', res.result.token);
          this.cookieService.set('admin_user_userName', res.result.username);
          this.router.navigateByUrl(this.returnUrl);
          this.spinner.hide();
          this.loginForm.reset();
        } else {
            this.toastr.error(res.message);
          }
      }
    );
  }

  togglePassword(event, oldPassword: any) {
    this.toggleEye = this.toggleEye == "ft-eye" ? "ft-eye-off" : "ft-eye";
    oldPassword.type = oldPassword.type === 'password' ? 'text' : 'password';
  }
}

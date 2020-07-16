import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'app/shared/services/common.service';
import { ValidationService } from "app/shared/services/validator.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GlobalService } from '../../shared/services/global.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private spinner: NgxSpinnerService,
    public global: GlobalService
  ) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, this.validationService.passwordValidator]],
      confirm_password: ['', Validators.required],
      emailToken: ['']
    },
      {
        validator: this.validationService.MatchPassword('password', 'confirm_password')
      });
  }

  onSubmit() {
    if (!this.resetPasswordForm.valid) {
      this.validationService.validateAllFormFields(this.resetPasswordForm);
      return false;
    }
    this.resetPasswordForm.value.emailToken = this.route.snapshot.paramMap.get('id');
    delete this.resetPasswordForm.value.confirm_password;
    this.commonService.resetPassword(this.resetPasswordForm.value).subscribe(
      (result: any) => {
        if (result.success) {
          this.global.successToastr(result.message);
          this.router.navigateByUrl('login');
        } else {
          this.global.errorToastr(result.message);
        }
        this.spinner.hide();
        this.resetPasswordForm.reset();
      }
    );
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'app/shared/services/common.service';
import { ValidationService } from "app/shared/services/validator.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-register-admin',
  templateUrl: './add-edit-admin.component.html',
  styleUrls: ['./add-edit-admin.component.scss']
})
export class AddEditAdminComponent implements OnInit {
  toggleEyePassword = "ft-eye-off";
  toggleEyeConfirmPassword = "ft-eye-off";
  loginObj: any = {};
  adminForm: FormGroup;
  submitted = false;
  editMode = true;
  label = 'Add Category';
  button = 'Submit';
  editAdmin;
  returnUrl: string;
  userType=[{
    type:'1',
    label:'Admin'
  },{
    type:'2',
    label:'Super Admin'
  }]

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
    this.adminForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      mobile_number: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirm_password: '',
    }, {
      validator: this.validationService.MatchPassword('password', 'confirm_password')
    });

    if (this.editAdmin) {
      this.setEditAdminData()
    } else {
      this.adminForm.controls['confirm_password'].setValidators([Validators.required]);
    }

  }


  setEditAdminData() {
    this.editMode = false;
    this.button = 'Update';
    this.adminForm.patchValue(this.editAdmin.data);
  }

  onSubmit() {
    if (!this.adminForm.valid) {
      this.validationService.validateAllFormFields(this.adminForm);
      return false;
    }
    this.commonService.register(this.adminForm.value).subscribe(
        (result: any) => {
          this.router.navigateByUrl(this.returnUrl);
          this.spinner.hide();
          this.adminForm.reset();
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

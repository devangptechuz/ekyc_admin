import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from "app/shared/services/validator.service";
import { NgxSpinnerService } from "ngx-spinner";
import {ActivatedRoute, Router} from '@angular/router';
import { AdminService } from '../../../shared/services/admin.service';
import {GlobalService} from '../../../shared/services/global.service';

@Component({
  selector: 'app-register-admin',
  templateUrl: './add-edit-admin.component.html',
  styleUrls: ['./add-edit-admin.component.scss']
})
export class AddEditAdminComponent implements OnInit {
  adminForm: FormGroup;
  editMode = true;
  label = 'Add Category';
  button = 'Submit';
  editAdmin;
  userType = [{
    type: '1',
    label: 'Super Admin'
  }, {
    type: '2',
    label: 'Admin'
  }]

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private spinner: NgxSpinnerService,
    public global: GlobalService
  ) { }

  ngOnInit(): void {
    this.editAdmin = this.route.snapshot.data["admin"];
    this.adminForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      userType: ['1', [Validators.required]],
      mobileNumber: ['', [Validators.required]],
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
    this.adminForm.controls["password"].clearValidators();
    this.adminForm.controls["confirm_password"].clearValidators();
    this.adminForm.updateValueAndValidity();
    this.adminForm.patchValue(this.editAdmin.result.userData);
    this.adminForm.controls.userType.setValue(this.editAdmin.result.userData.userType.toString())
  }

  onSubmit() {
    if (!this.adminForm.valid) {
      this.validationService.validateAllFormFields(this.adminForm);
      return false;
    }
    delete this.adminForm.value.confirm_password;
    if (this.editMode) {
      this.adminService.addAdmin(this.adminForm.value).subscribe(
        (result: any) => {
          if (result.success) {
            this.router.navigateByUrl('/admins');
            this.spinner.hide();
            this.adminForm.reset();
          } else {
            this.global.errorToastr(result.message);
          }
        });
    } else {
      this.editAdminCall();
    }

  }

  editAdminCall() {
    delete this.adminForm.value.email;
    delete this.adminForm.value.password;
    this.adminForm.value.id = this.editAdmin.result.userData.id;
    this.adminService.updateAdmin(this.adminForm.value).subscribe(
      (result: any) => {
        if (result.success) {
          this.router.navigateByUrl('/admins');
          this.spinner.hide();
          this.adminForm.reset();
        } else {
          this.global.errorToastr(result.message);
        }
      });
  }
}

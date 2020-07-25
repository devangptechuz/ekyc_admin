import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from "app/shared/services/validator.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../shared/services/admin.service';
import { GlobalService } from '../../../shared/services/global.service';
import { FileUploader } from 'ng2-file-upload';

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
  uploader: FileUploader;
  adminTitle = 'Add new admin user';
  userProfileURL: any;
  formData;
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
      mobileNumber: ['', [Validators.required, this.validationService.mobileFormat]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.validationService.passwordValidator]],
      confirm_password: '',
      userProfile: ''
    }, {
      validator: this.validationService.MatchPassword('password', 'confirm_password')
    });

    if (this.editAdmin) {
      this.setEditAdminData()
    } else {
      this.adminForm.controls['confirm_password'].setValidators([Validators.required]);
    }

  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      this.spinner.show();
      const file = event.target.files[0];
      this.adminForm.get('userProfile').setValue(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.userProfileURL = reader.result as string;
        this.spinner.hide();
      };
      reader.readAsDataURL(file)
    }
  }

  removeuserProfiles() {
    this.userProfileURL = null;
    this.adminForm.controls.userProfile.setValue('');
  }


  setEditAdminData() {
    this.editMode = false;
    this.adminTitle = 'Update admin user'
    this.button = 'Update';
    this.adminForm.controls["password"].clearValidators();
    this.adminForm.controls["confirm_password"].clearValidators();
    this.adminForm.updateValueAndValidity();
    this.adminForm.patchValue(this.editAdmin.result.userData);
    this.adminForm.controls.userType.setValue(this.editAdmin.result.userData.userType.toString())
    if (this.editAdmin.result.userData.userProfile_url && this.editAdmin.result.userData.userProfile_url !== '') {
      this.userProfileURL = this.editAdmin.result.userData.userProfile_url;
    }
    if (!this.editAdmin.result.userData.userProfile_url) {
      this.userProfileURL = '';
    }
  }

  onSubmit() {
    if (!this.adminForm.valid) {
      this.validationService.validateAllFormFields(this.adminForm);
      return false;
    }
    this.formData = new FormData();
    this.formData.append('api_name', 'insert_sub_admin');
    this.formData.append('userProfile', this.adminForm.get('userProfile').value);
    Object.entries(this.adminForm.value).forEach(
      ([key, value]: any[]) => {
        this.formData.set(key, value);
      });
    this.formData.delete('confirm_password');
    if (this.editMode) {
      this.adminService.addAdmin(this.formData).subscribe(
        (result: any) => {
          if (result.success) {
            this.router.navigateByUrl('/admins');
            this.global.successToastr(result.message);
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
    this.formData.delete('email');
    this.formData.delete('password');
    this.formData.append('id', this.editAdmin.result.userData.id);
    this.formData.append('api_name', 'update_admin');
    this.formData.append('profileImage', this.editAdmin.result.userData.userProfile);
    this.adminService.updateAdmin(this.formData).subscribe(
      (result: any) => {
        if (result.success) {
          this.router.navigateByUrl('/admins');
          this.global.successToastr(result.message);
          this.spinner.hide();
          this.adminForm.reset();
        } else {
          this.global.errorToastr(result.message);
        }
      });
  }

  removeImages() {
    this.userProfileURL = null;
    this.adminForm.controls.userProfile.setValue('');
  }
}

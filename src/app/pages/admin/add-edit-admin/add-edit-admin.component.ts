import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from "app/shared/services/validator.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../shared/services/admin.service';
import { GlobalService } from '../../../shared/services/global.service';
import { FileUploader } from 'ng2-file-upload';
import { CommonService } from '../../../shared/services/common.service';

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
  password: string;
  userType = [{
    type: '1',
    label: 'Super Admin'
  }, {
    type: '2',
    label: 'Admin'
  }, {
    type: '3',
    label: 'RM'
  }];

  permissionLists = [];
  userPermission: FormArray;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private spinner: NgxSpinnerService,
    public global: GlobalService,
    public commonService: CommonService
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
      userProfile: '',
      userPermission: this.formBuilder.array([]),
      rm_code: new FormControl('')
    }, {
      validator: this.validationService.MatchPassword('password', 'confirm_password')
    });

    if (this.editAdmin) {
      this.setEditAdminData()
    } else {
      this.adminForm.controls['confirm_password'].setValidators([Validators.required]);
    }

    this.getPermissionsList();
  }

  // get userPermission(){
  // userPermission =  this.adminForm.get('userPermission') as FormArray;
  // this.userPermission.push(this.createPermission(value));
  // }

  hidePermission($event) {
    // console.log('devaaaa', $event);
    if (Number($event) === 3) {
      // console.log('devaa --+++++', $event);
      this.adminForm.get('rm_code').setValidators([Validators.required, this.validationService.RMCode]);
      this.adminForm.get('rm_code').updateValueAndValidity();
    } else {
      this.adminForm.get('rm_code').clearValidators();
      this.adminForm.get('rm_code').updateValueAndValidity();
    }
  }

  getPermissionsList() {
    this.adminService.getPermissionList().subscribe((res: any) => {
      if (res.success) {
        this.permissionLists = res.result;
        // console.log('test', this.editAdmin.result.userData);
        this.permissionLists.map((item) => {
          item['selected'] = false;
          if (this.editAdmin?.result?.userData?.userPermissions) {
            const permissionId = this.editAdmin.result.userData.userPermissions.includes(item.id);
            if (permissionId) {
              item['selected'] = true;
            }
          }
          // console.log('permissionId', permissionId, item);
          this.userPermission = this.adminForm.get('userPermission') as FormArray;
          this.userPermission.push(this.createPermission(item));
        });
        // console.log('testdssss*****', this.userPermission);
      }
    });
  }

  /**
   * Set up FormArray
   * @param value 
   */
  createPermission(value): FormGroup {
    let selectedVar = false;
    // console.log('value', value);
    if (value?.selected) {
      selectedVar = value.selected;
    }
    return this.formBuilder.group({
      selected: selectedVar,
      permission_id: value.id,
      permission_name: value.permissionName,
    });
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
    if (Number(this.editAdmin.result.userData.userType) === 3) {
      this.hidePermission(this.editAdmin.result.userData.userType);
      this.adminForm.patchValue({ 'rm_code': this.editAdmin.result.userData.rmCode });
    }
  }

  onSubmit() {
    if (!this.adminForm.valid) {
      this.validationService.validateAllFormFields(this.adminForm);
      return false;
    }
    const selectedData = this.adminForm.value.userPermission.filter(ele => ele.selected === true);
    // console.log('selectedData', selectedData);
    let pemissionIds = [];
    selectedData.map((item) => {
      pemissionIds.push(item.permission_id)
    });
    this.formData = new FormData();
    this.formData.append('userProfile', this.adminForm.get('userProfile').value);
    Object.entries(this.adminForm.value).forEach(
      ([key, value]: any[]) => {
        if (key !== 'userPermission') {
          this.formData.set(key, value);
        }
      });
    // console.log('pemissionIds.join()', pemissionIds.join());
    this.formData.append('userPermission', selectedData);
    this.formData.append('permissions', pemissionIds.join());
    // console.log('this.adminForm.value', this.adminForm.value);
    this.formData.delete('confirm_password');
    if (this.editMode) {
      this.formData.append('api_name', 'insert_sub_admin');

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

  /**
   * Change Permission
   */
  selectPermission($event, permissionId: string | number) {
    // console.log('planId', $event.target.checked, permissionId);
    const planId = $event.target.checked;
    let parentArray = this.adminForm.get('userPermission') as FormArray;
    if (planId) {
      // console.log('parentArray.controls', parentArray.controls);
      parentArray.controls.map((ctrl: FormControl) => {
        if (ctrl.value.permission_id === permissionId) {//match with category id
          ctrl.patchValue({ selected: true });
        }
      });
    } else { // deselect main category, subcategory, plans too...
      parentArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value.permission_id === permissionId) {//match with category id
          ctrl.patchValue({ selected: false });
        }
      });
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

  current_password(value) {
    const input = document.getElementById(value);
    if (input.getAttribute('type') === 'password') {
      input.setAttribute('type', 'text');
      (<HTMLInputElement>document.getElementById(value + 'img')).setAttribute('src', 'assets/images/eye-close.svg');
    } else {
      input.setAttribute('type', 'password');
      (<HTMLInputElement>document.getElementById(value + 'img')).setAttribute('src', 'assets/images/eye.svg');
    }
  }


  removeImages() {
    this.userProfileURL = null;
    this.adminForm.controls.userProfile.setValue('');
  }
}

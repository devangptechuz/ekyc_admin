import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from 'app/shared/services/validator.service';
import { UserService } from 'app/shared/services/user.service';
import { GlobalService } from 'app/shared/services/global.service';
import { GlobalConfigureService } from 'app/shared/services/global-configure.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  emailConfigForm: FormGroup;

  companyLogoURL: any;
  formData: FormData;
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
    this.setFormValidation();
    this.getEmailConfigureDetails();
  }

  /**
   * Set Form Validation
   */
  setFormValidation() {
    this.emailConfigForm = this.fb.group({
      company_name: new FormControl('', [Validators.required]),
      facebook_url: new FormControl('', [Validators.required]),
      twitter_url: new FormControl('', [Validators.required]),
      company_email: new FormControl('', [Validators.required]),
      company_contact_number: new FormControl('', [Validators.required, this.validate.mobileNumberValidator]),
      company_logo: new FormControl('', [Validators.required]),
      company_address: new FormControl('', [Validators.required]),
      company_copyright_text: new FormControl('', [Validators.required])
    });
  }

  /**
   * Get Email Configure Details
   */
  getEmailConfigureDetails() {
    this.globalConfigureService.getEmailConfigureData().subscribe((res: any) => {
      if (res.success) {
        this.global.successToastr(res.message);
      }
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.emailConfigForm.get('company_logo').setValue(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.companyLogoURL = reader.result as string;
      };
      reader.readAsDataURL(file)
    }
  }

  removeuserProfiles() {
    this.companyLogoURL = null;
    this.emailConfigForm.controls.company_logo.setValue('');
  }

  removeImages() {
    this.companyLogoURL = null;
    this.emailConfigForm.controls.company_logo.setValue('');
  }

  emailConfigFormSubmit() {
    if (!this.emailConfigForm.valid) {
      this.validate.validateAllFormFields(this.emailConfigForm);
      return false;
    }

    this.formData = new FormData();
    this.formData.append('api_name', 'add_company_configuration');
    this.formData.append('files', this.emailConfigForm.get('company_logo').value);
    Object.entries(this.emailConfigForm.value).forEach(
      ([key, value]: any[]) => {
        if (key !== 'company_logo') {
          this.formData.set(key, value);
        }
      });
    this.globalConfigureService.submitEmailConfig(this.formData).subscribe((res: any) => {
      if (res.success) {
        this.global.successToastr(res.message);
      }
    });
  }

}

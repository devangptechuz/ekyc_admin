import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from 'app/shared/services/validator.service';
import { UserService } from 'app/shared/services/user.service';
import { GlobalService } from 'app/shared/services/global.service';
import { GlobalConfigureService } from 'app/shared/services/global-configure.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  emailConfigForm: FormGroup;

  formData: FormData;
  companyLogoURL: any;
  facebookURL: any;
  twitterURL: any;
  LogoURL1: any;
  LogoURL2: any;
  LogoURL3: any;
  LogoURL4: any;
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public validate: ValidationService,
    private userService: UserService,
    private global: GlobalService,
    private globalConfigureService: GlobalConfigureService
  ) { }

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
      company_url: new FormControl('', [Validators.required]),
      company_email: new FormControl('', [Validators.required]),
      company_contact_number: new FormControl('', [Validators.required, this.validate.mobileNumberValidator]),
      company_logo: new FormControl(''),
      company_address: new FormControl('', [Validators.required]),
      company_copyright_text: new FormControl('', [Validators.required]),
      twitter_logo: new FormControl(''),
      facebook_logo: new FormControl(''),
      url1_logo: new FormControl(''),
      url2_logo: new FormControl(''),
      url3_logo: new FormControl(''),
      url4_logo: new FormControl(''),
      url1: new FormControl(''),
      url2: new FormControl(''),
      url3: new FormControl(''),
      url4: new FormControl('')
    });
  }

  /**
   * Get Email Configure Details
   */
  getEmailConfigureDetails(hideLoader: boolean = false) {
    this.globalConfigureService.getEmailConfigureData(hideLoader).subscribe((res: any) => {
      if (res.success) {
        if (res.result) {
          this.emailConfigForm.patchValue({
            company_name: res.result.company_name,
            company_contact_number: res.result.company_contact_number,
            company_copyright_text: res.result.company_copyright_text,
            company_email: res.result.company_email,
            company_log: res.result.company_log,
            company_logo: res.result.company_logo,
            company_address: res.result.company_address,
            facebook_url: res.result.facebook_url,
            twitter_url: res.result.twitter_url,
            company_url: res.result.company_url,
            twitter_logo: res?.result?.twitter_logo || '',
            facebook_logo: res?.result?.facebook_logo || '',
            url1_logo: res?.result?.url1_logo || '',
            url2_logo: res?.result?.url2_logo || '',
            url3_logo: res?.result?.url3_logo || '',
            url4_logo: res?.result?.url4_logo || '',
            url1: res?.result?.url1 || '',
            url2: res?.result?.url2 || '',
            url3: res?.result?.url3 || '',
            url4: res?.result?.url4 || ''
          });
        }
        if (res.result.company_logo) {
          this.emailConfigForm.get('company_logo').setValue('');
          this.companyLogoURL = res.result.company_logo;
        }

        if (res.result.twitter_logo) {
          this.emailConfigForm.get('twitter_logo').setValue('');
          this.twitterURL = res.result.twitter_logo;
        }

        if (res.result.facebook_logo) {
          this.emailConfigForm.get('facebook_logo').setValue('');
          this.facebookURL = res.result.facebook_logo;
        }

        if (res.result.url1_logo) {
          this.emailConfigForm.get('url1_logo').setValue('');
          this.LogoURL1 = res.result.url1_logo;
        }

        if (res.result.url2_logo) {
          this.emailConfigForm.get('url2_logo').setValue('');
          this.LogoURL2 = res.result.url2_logo;
        }

        if (res.result.url3_logo) {
          this.emailConfigForm.get('url3_logo').setValue('');
          this.LogoURL3 = res.result.url3_logo;
        }

        if (res.result.url4_logo) {
          this.emailConfigForm.get('url4_logo').setValue('');
          this.LogoURL4 = res.result.url4_logo;
        }
      }
    });
  }


  onFileSelect(event, nameOfFile: any = '') {
    console.log('event.target.files', event.target.files);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      if (nameOfFile === 'twitter_logo') {
        this.emailConfigForm.get('twitter_logo').setValue(file);
        reader.onload = () => {
          this.twitterURL = reader.result as string;
        };
      }
      if (nameOfFile === 'facebook_logo') {
        this.emailConfigForm.get('facebook_logo').setValue(file);
        reader.onload = () => {
          this.facebookURL = reader.result as string;
        };
      }
      if (nameOfFile === 'url1_logo') {
        this.emailConfigForm.get('url1_logo').setValue(file);
        reader.onload = () => {
          this.LogoURL1 = reader.result as string;
        };
      }
      if (nameOfFile === 'url2_logo') {
        this.emailConfigForm.get('url2_logo').setValue(file);
        reader.onload = () => {
          this.LogoURL2 = reader.result as string;
        };
      }
      if (nameOfFile === 'url3_logo') {
        this.emailConfigForm.get('url3_logo').setValue(file);
        reader.onload = () => {
          this.LogoURL3 = reader.result as string;
        };
      }
      if (nameOfFile === 'url4_logo') {
        this.emailConfigForm.get('url4_logo').setValue(file);
        reader.onload = () => {
          this.LogoURL4 = reader.result as string;
        };
      }
      if (nameOfFile === 'company_logo') {
        this.emailConfigForm.get('company_logo').setValue(file);
        reader.onload = () => {
          this.companyLogoURL = reader.result as string;
        };
      }
      reader.readAsDataURL(file)
    }
  }

  /**
   * Remove images of company 
   * @param nameOfLogo 
   */
  removeImages(nameOfLogo: string) {
    if (nameOfLogo === 'company_logo') {
      this.companyLogoURL = null;
      this.emailConfigForm.controls.company_logo.setValue('');
    } else if (nameOfLogo === 'twitter_logo') {
      this.twitterURL = null;
      this.emailConfigForm.controls.twitter_logo.setValue('');
    } else if (nameOfLogo === 'facebook_logo') {
      this.facebookURL = null;
      this.emailConfigForm.controls.facebook_logo.setValue('');
    } else if (nameOfLogo === 'url1_logo') {
      this.LogoURL1 = null;
      this.emailConfigForm.controls.url1_logo.setValue('');
    } else if (nameOfLogo === 'url2_logo') {
      this.LogoURL2 = null;
      this.emailConfigForm.controls.url2_logo.setValue('');
    } else if (nameOfLogo === 'url3_logo') {
      this.LogoURL3 = null;
      this.emailConfigForm.controls.url3_logo.setValue('');
    } else if (nameOfLogo === 'url4_logo') {
      this.LogoURL4 = null;
      this.emailConfigForm.controls.url4_logo.setValue('');
    }
    const obj: any = { name: nameOfLogo };
    this.globalConfigureService.deleteCompanyImagesIcon(obj).subscribe((res: any) => {
      if (res.success) {
        this.global.successToastr(res.message);
      }
    });
  }

  emailConfigFormSubmit() {
    if (!this.emailConfigForm.valid) {
      this.validate.validateAllFormFields(this.emailConfigForm);
      return false;
    }

    this.formData = new FormData();
    this.formData.append('api_name', 'add_company_configuration');
    if (this.emailConfigForm.get('company_logo').value) {
      this.formData.append('files', this.emailConfigForm.get('company_logo').value);
    } else if (!this.companyLogoURL) {
      this.formData.append('is_image_deleted', 'true');
    }

    if (this.emailConfigForm.get('twitter_logo').value) {
      this.formData.append('twitter_logo', this.emailConfigForm.get('twitter_logo').value);
    }
    if (this.emailConfigForm.get('facebook_logo').value) {
      this.formData.append('facebook_logo', this.emailConfigForm.get('facebook_logo').value);
    }

    if (this.emailConfigForm.get('url1_logo').value) {
      this.formData.append('url1_logo', this.emailConfigForm.get('url1_logo').value);
    }
    if (this.emailConfigForm.get('url2_logo').value) {
      this.formData.append('url2_logo', this.emailConfigForm.get('url2_logo').value);
    }
    if (this.emailConfigForm.get('url3_logo').value) {
      this.formData.append('url3_logo', this.emailConfigForm.get('url3_logo').value);
    }
    if (this.emailConfigForm.get('url4_logo').value) {
      this.formData.append('url4_logo', this.emailConfigForm.get('url4_logo').value);
    }
    Object.entries(this.emailConfigForm.value).forEach(
      ([key, value]: any[]) => {
        if (key !== 'company_logo' && key !== 'twitter_logo' && key !== 'facebook_logo' && key !== 'url1_logo' && key !== 'url2_logo' && key !== 'url3_logo' && key !== 'url4_logo') {
          this.formData.set(key, value);
        }
      });
    this.globalConfigureService.submitEmailConfig(this.formData).subscribe((res: any) => {
      if (res.success) {
        this.getEmailConfigureDetails(true);
        this.global.successToastr(res.message);
      }
    });
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GlobalConfigureService } from 'app/shared/services/global-configure.service';
import { GlobalService } from 'app/shared/services/global.service';
import { ActivatedRoute, Router } from '@angular/router';

import * as Editor from '../../../../ckeditor5-classic/build/ckeditor';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
@Component({
  selector: 'app-add-edit-email-template',
  templateUrl: './add-edit-email-template.component.html',
  styleUrls: ['./add-edit-email-template.component.scss']
})
export class AddEditEmailTemplateComponent implements OnInit {
  editorInstance: any;
  templateForm: FormGroup;
  Title = 'Add new Email Template';
  emailPlaceHolders: any;
  editEmailTemplate: any;

  ckEditorWithToolbar = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'indent',
        'outdent',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'undo',
        'redo',
        'FontSize',
        'Highlight'
      ]
    },
  };
  public Editor = Editor;
  public config = {
    language: 'en'
  };
  public editorValue: string = '';
  actionList = [{ value: 'login', label: 'Login' }, { value: 'register', label: 'Register' },
  { value: 'emailVerify', label: 'Email Verify' }, { value: 'forgotPassword', label: 'Forgot Password' }
    , { value: 'insertSubAdmin', label: 'Insert Sub Admin' }, { value: 'sendReasonInfo', label: 'Send Reason Info' },
  { value: 'other', label: 'Other' }]
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private global: GlobalService,
    private globalConfigureService: GlobalConfigureService
  ) { }

  ngOnInit(): void {
    this.editEmailTemplate = this.route.snapshot.data["getTemplate"];
    this.getAllEmailPlaceholders();
    this.setFormValidation();
    if (this.editEmailTemplate) {
      this.Title = 'Edit Email Template';
      this.patchValue();
    }
  }

  getAllEmailPlaceholders() {
    this.globalConfigureService.emailConfiguration().subscribe((res: any) => {
      if (res.success) {
        this.emailPlaceHolders = res.result;
      }
    })
  }

  setFormValidation() {
    this.templateForm = this.fb.group({
      template_name: new FormControl('', [Validators.required]),
      action: new FormControl(null, [Validators.required]),
      subject_for_email: new FormControl('', [Validators.required]),
      email_content: new FormControl('', [Validators.required])
    });
  }

  /**
   * Patch value of email templates
   */
  patchValue() {
    this.templateForm.patchValue({
      template_name: this.editEmailTemplate.result.template_name,
      action: this.editEmailTemplate.result.action,
      subject_for_email: this.editEmailTemplate.result.subject_for_email,
      email_content: this.editEmailTemplate.result.email_content
    });
  }

  onSubmit() {
    const objParams = this.templateForm.value;
    objParams['status'] = 1;
    if (this.editEmailTemplate) {
      objParams['id'] = this.editEmailTemplate.result.id;
      this.globalConfigureService.updateEmailTemplate(objParams).subscribe((res: any) => {
        if (res.success) {
          this.global.successToastr(res.message);
          this.router.navigate(['common-configure/list-email-template']);
        }
      });
    } else {
      this.globalConfigureService.AddEmailTemplate(objParams).subscribe((res: any) => {
        if (res.success) {
          this.global.successToastr(res.message);
          this.router.navigate(['common-configure/list-email-template']);
        }
      });
    }
  }

  onReady(editor) {
    this.editorInstance = editor;
  }

  // add content to ckeditor
  addContentToEditor(htmlString) {
    // console.log('addContentToEditor', htmlString);
    const htmlDP = this.editorInstance.data.processor;
    const viewFragment = htmlDP.toView(`[${htmlString}]`);
    // console.log('viewFragment', viewFragment);
    const modelFragment = this.editorInstance.data.toModel(viewFragment);
    // console.log('modelFragment', modelFragment);
    this.editorInstance.model.insertContent(modelFragment);
  }

}

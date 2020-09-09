import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GlobalConfigureService } from 'app/shared/services/global-configure.service';
import { GlobalService } from 'app/shared/services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';

@Component({
  selector: 'app-add-edit-email-template',
  templateUrl: './add-edit-email-template.component.html',
  styleUrls: ['./add-edit-email-template.component.scss']
})
export class AddEditEmailTemplateComponent implements OnInit {
  ckEditorWithImageConfig = {
    'toolbarGroups': [
      { 'name': 'basicstyles', 'groups': ['basicstyles'] },
      { 'name': 'links', 'groups': ['links'] },
      { 'name': 'styles', 'groups': ['heading'] },
      { 'name': 'paragraph', 'groups': ['list', 'blocks', 'indent'] },
      { 'name': 'document', 'groups': ['mode', 'undo'] }
    ],
    'removeButtons': 'Save,Templates,Find,Replace,Scayt,SelectAll,Subscript,Superscript,CreateDiv,NewPage,Print,Preview,' +
      'Anchor,Font,FontSize,Styles,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe',
    'removePlugins': 'elementspath',
    'removeDialogTabs': 'image:advanced',
    'extraAllowedContent': '*(*)',
    'allowedContent': true,
    // 'fullPage': true,
    'enterMode': 'CKEDITOR.ENTER_DIV'
  };
  editorInstance: any;
  templateForm: FormGroup;
  Title = 'Add new Email Template';
  emailPlaceHolders: any;
  editEmailTemplate: any;
  public editorValue: string = '';


  actionList = [];
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
        if (res?.result?.emailAction) {
          this.actionList = res.result.emailAction
        }
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

  onReady(event: CKEditor4.EventInfo) {
    this.editorInstance = event.editor;
    console.log(event.editor.getData());
  }

  // add content to ckeditor
  addContentToEditor(htmlString) {
    console.log('addContentToEditor', this.editorInstance);
    // const htmlDP = this.editorInstance.dataProcessor;
    // const viewFragment = htmlDP.toView(`[${htmlString}]`);
    // console.log('viewFragment', viewFragment);
    // const modelFragment = this.editorInstance.dataProcessor.toModel(viewFragment);
    // console.log('modelFragment', modelFragment);
    this.editorInstance.insertText(`[${htmlString}]`);
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ValidationService} from '../../../shared/services/validator.service';
import {SettingService} from '../../../shared/services/setting.service';
import {GlobalService} from '../../../shared/services/global.service';

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.scss']
})
export class AddEditCategoryComponent implements OnInit {
  @Input() title: string;
  @Input() fromParent: string;
  subCategoryForm: FormGroup;
  categories = [];
  selected;

  constructor(private activeModal: NgbActiveModal,
              private formBuilder: FormBuilder,
              private validationService: ValidationService,
              private settingService:SettingService,
              public global: GlobalService) { }

  async ngOnInit(){
    this.subCategoryForm = this.formBuilder.group({
      reason: ['', [Validators.required]],
      reasonId: ['1', [Validators.required]],
    });
    setTimeout(()=>{
      this.getReasons();
    },500)

  }

  getReasons(){
    this.settingService.getReasonCategory()
      .subscribe(
      Data => {
            if (Data.success) {
              this.categories = [...Data['result']['reasonCategory']];
            } else {
               this.global.errorToastr(Data.message);
            }
    });
    if(this.fromParent){
      this.subCategoryForm.controls.reason.setValue(this.fromParent['reason'])
      this.subCategoryForm.controls.reasonId.setValue(this.fromParent['reasonId'])
    }
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    if (!this.subCategoryForm.valid) {
      this.validationService.validateAllFormFields(this.subCategoryForm);
      return false;
    }
    if(this.fromParent){
      this.subCategoryForm.value.id = this.fromParent['id'];
      this.settingService.updateSubReasonCategory(this.subCategoryForm.value).subscribe(
          (result: any) => {
            if (result.success) {
              this.global.successToastr(result.message);
              this.subCategoryForm.reset();
            } else {
              this.global.errorToastr(result.message);
            }
        });
    } else {
      this.settingService.addSubReasonCategory(this.subCategoryForm.value).subscribe(
          (result: any) => {
            if (result.success) {
              this.global.successToastr(result.message);
              this.subCategoryForm.reset();
            } else {
              this.global.errorToastr(result.message);
            }
        });
    }
    this.activeModal.close(true);
  }

  onSubmit() {

  }


  public dismiss() {
    this.activeModal.dismiss();
  }

}

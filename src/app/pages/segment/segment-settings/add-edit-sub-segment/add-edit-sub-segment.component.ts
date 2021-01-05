import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidationService } from '../../../../shared/services/validator.service';
import { SettingService } from '../../../../shared/services/setting.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-edit-sub-segment',
  templateUrl: './add-edit-sub-segment.component.html',
  styleUrls: ['./add-edit-sub-segment.component.scss']
})
export class AddEditSubSegmentComponent implements OnInit {
  @Input() title: string;
  @Input() fromParent: string;
  @Input() id: string;
  headerTitle = 'Add Sub-Segment type';
  subSegmentForm: FormGroup;
  segments = [];
  constructor(private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private settingService: SettingService,
    public global: GlobalService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.fromParent) {
      this.headerTitle = 'Edit Sub-Segment type';
    }
    this.subSegmentForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
    });
    setTimeout(() => {
      this.getSegments();
    }, 500)
  }

  getSegments() {
    this.settingService.getSegmentCategory()
      .subscribe(
        Data => {
          if (Data.success) {
            this.segments = [...Data['result']['Items']];
            if (!this.fromParent) {
              this.segments.filter((data, i) => {
                if (data.id == this.id['id']) {
                  this.subSegmentForm.controls.category_id.setValue(this.segments[i].id)
                }
              })
            }
          } else {
            this.global.errorToastr(Data.message);
          }
          if (this.fromParent) {
            this.subSegmentForm.controls.name.setValue(this.fromParent['name']);
            this.subSegmentForm.controls.category_id.setValue(this.fromParent['category_id']);
          }
        });
  }
  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    if (!this.subSegmentForm.valid) {
      this.validationService.validateAllFormFields(this.subSegmentForm);
      return false;
    }
    if (this.fromParent) {
      this.settingService.updateSegmentSubCategory(this.fromParent['subSegmentId'], this.subSegmentForm.value).subscribe(
        (result: any) => {
          if (result.success) {
            this.global.successToastr(result.message);
            this.subSegmentForm.reset();
          } else {
            this.global.errorToastr(result.message);
          }
          this.activeModal.close(true);
        });
    } else {
      this.settingService.addSegmentSubCategory(this.subSegmentForm.value).subscribe(
        (result: any) => {
          if (result.success) {
            this.global.successToastr(result.message);
            this.subSegmentForm.reset();
          } else {
            this.global.errorToastr(result.message);
          }
          this.activeModal.close(true);
        });
    }
  }
}

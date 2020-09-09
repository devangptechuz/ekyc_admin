import {Component, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {Router} from '@angular/router';
import {SettingService} from '../../../../shared/services/setting.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/global.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddEditBrokeragePlanComponent} from '../../brokerage-plan/add-edit-brokerage-plan/add-edit-brokerage-plan.component';
import {AddEditBrokerageCodeComponent} from '../add-edit-brokerage-code/add-edit-brokerage-code.component';
import {AddEditCategoryComponent} from '../../application-settings/add-edit-category/add-edit-category.component';

@Component({
  selector: 'app-brokerage-code-list',
  templateUrl: './brokerage-code-list.component.html',
  styleUrls: ['./brokerage-code-list.component.scss']
})
export class BrokerageCodeListComponent implements OnInit {
  temp = [];
  rows = [];
  status = [
    {label:'Inactive', value:'0'},
    {label: 'Active', value: '1'}];
  loadingIndicator = true;
  modalRef:any;
  limitRow: Number = environment.adminlimitRow;
  formData;
  csvFile;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(private router: Router,
              private settingService: SettingService,
              private spinner: NgxSpinnerService,
              public global: GlobalService,
              private modalService:NgbModal) { }

  ngOnInit(): void {
    this.callApiBrokerageCode();
  }

  callApiBrokerageCode(){
    this.settingService.getBrokerageMasterList()
        .subscribe(
            Data => {
              if (Data.success) {
                this.temp = [...Data['result']];
                this.rows = Data['result'];
              } else {
                this.global.errorToastr(Data.message);
              }
          });
  }

  addNewBrokerageCode(){
    this.modalRef = this.modalService.open(AddEditBrokerageCodeComponent, { centered: true, windowClass:'catreason-popup',backdrop: 'static', keyboard: false,backdropClass:'white' });
    this.modalRef.result.then((result) => {
      if(result){
        this.callApiBrokerageCode();
      }
    });
  }

  onEdit(v) {
    const modelRef = this.modalService.open(AddEditBrokerageCodeComponent, { centered: true, windowClass: 'catreason-popup', backdrop: 'static', keyboard: false, backdropClass: 'white' });
    const modelData = {};
    modelData["segmentCode"] = v.segmentCode;
    modelData["segmentCodeDescription"] = v.segmentCodeDescription;
    modelData["segmentCodeName"] = v.segmentCodeName;
    modelData["segmentCodeType"] = v.segmentCodeType;
    modelData["id"] = v.id;
    modelData["isEdit"] = true;
    modelRef.componentInstance.fromParent = modelData;
    modelRef.result.then((result) => {
      if (result) {
        this.callApiBrokerageCode();
      }
    })
  }

  changeStatus(event, row) {
    const val = event.target.value;
    let categoryStatus = {};
    categoryStatus['status'] = val;
    categoryStatus['segmentCode'] = row.segmentCode;
    this.settingService.changeBrokerageStatus(categoryStatus)
        .subscribe((res) => {
          if (res.success) {
            this.global.successToastr(res.message);
          } else {
            this.global.errorToastr(res.message);
          }
        });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.csvFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file)
    }else {
      this.csvFile = null;
    }
  }

  submitFile(){
    this.formData = new FormData();
    this.formData.append('filename', this.csvFile);
    this.formData.append('api_name', 'add_brokerage_csv');
    this.settingService.csvFileUpload(this.formData).subscribe(
        (result: any) => {
          if (result.success) {
            this.global.successToastr(result.message);
            this.callApiBrokerageCode();
          } else {
            this.global.errorToastr(result.message);
          }
        });
  }


}

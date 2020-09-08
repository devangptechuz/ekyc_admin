import {Component, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {Router} from '@angular/router';
import {SettingService} from '../../../../shared/services/setting.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/global.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddEditBrokeragePlanComponent} from '../add-edit-brokerage-plan/add-edit-brokerage-plan.component';

@Component({
  selector: 'app-segment-plan-list',
  templateUrl: './brokerage-plan-list.component.html',
  styleUrls: ['./brokerage-plan-list.component.scss']
})
export class BrokeragePlanListComponent implements OnInit {
  temp = [];
  rows = [];
  status = [
    {label:'Inactive', value:'0'},
    {label: 'Active', value: '1'}];
  loadingIndicator = true;
  modalRef:any;
  limitRow: Number = environment.adminlimitRow;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
      private router: Router,
      private settingService: SettingService,
      private spinner: NgxSpinnerService,
      public global: GlobalService,
      private modalService:NgbModal
  ) { }

  ngOnInit(): void {
    this.callApiSegmentPlans();
  }

  callApiSegmentPlans(){
    this.settingService.getSegmentPlansList().subscribe(
            Data => {
              if (Data.success) {
                this.temp = [...Data['result']];
                this.rows = Data['result'];
                this.spinner.hide();
              } else {
                this.spinner.hide();
                this.global.errorToastr(Data.message);
              }
            });
  }

  addNewSegmentPlan(){
    this.modalRef = this.modalService.open(AddEditBrokeragePlanComponent, { centered: true, windowClass:'catreason-popup',backdrop: 'static', keyboard: false,backdropClass:'white' });
    this.modalRef.result.then((result) => {
      if(result){
        this.callApiSegmentPlans();
      }
    });
  }

  onEdit(v){
    const modelRef = this.modalService.open(AddEditBrokeragePlanComponent, { centered: true, windowClass:'catreason-popup',backdrop: 'static', keyboard: false,backdropClass:'white' });
    const modelData = {};
    modelData["plan_name"] = v.name;
    modelData["segmentCode"] = v.segmentCode;
    modelData["category_id"] = v.categoryId;
    modelData["sub_category_id"] = v.subCategoryId;
    modelData["id"] = v.id;
    modelData["isEdit"] = true;
    modelRef.componentInstance.fromParent = modelData;
    modelRef.result.then((result)=>{
      if(result){
        this.callApiSegmentPlans();
      }
    })
  }

  changeStatus(event,row) {
    const val = event.target.value;
    let categoryStatus = {};
    categoryStatus['status'] = val;
    this.settingService.changeSegmentPlansStatus(row.id,categoryStatus)
        .subscribe((res) => {
          if (res.success) {
            this.global.successToastr(res.message);
          } else {
            this.global.errorToastr(res.message);
          }
        });
  }

}

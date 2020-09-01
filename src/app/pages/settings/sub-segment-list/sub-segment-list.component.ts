import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingService} from '../../../shared/services/setting.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../shared/services/global.service';
import {SharedService} from '../../../shared/services/shared.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddEditCategoryComponent} from '../add-edit-category/add-edit-category.component';
import {AddEditSubSegmentComponent} from '../add-edit-sub-segment/add-edit-sub-segment.component';

@Component({
  selector: 'app-sub-segment-list',
  templateUrl: './sub-segment-list.component.html',
  styleUrls: ['./sub-segment-list.component.scss']
})
export class SubSegmentListComponent implements OnInit {
  rows = [];
  selected = [];
  loadingIndicator = true;
  limitRow: Number = environment.adminlimitRow;
  count: any;
  selectFlag = false;
  subCategorySegmentData;
  modalRef:any;
  status = [
    {label:'Inactive', value:'0'},
    {label: 'Active', value: '1'}];
  constructor(private router: Router,
              private settingService: SettingService,
              private spinner: NgxSpinnerService,
              private route: ActivatedRoute,
              public global: GlobalService,
              private sharedService:SharedService,
              private modalService:NgbModal) { }

  ngOnInit(): void {
    this.subCategorySegmentData = this.route.snapshot.data["segments"];
    if(this.subCategorySegmentData?.success){
      this.rows = [...this.subCategorySegmentData.result['segmentSubCategoryList']]
    }
  }

  getSubCategorySegmentData(){
    this.settingService.getSegmentSubCategory(this.route.snapshot.params.id)
        .subscribe((res) => {
          if (res.success) {
            this.rows = [...res.result['segmentSubCategoryList']]
          } else {
            this.global.errorToastr(res.message);
          }
        });
  }


  setRouterLink(){
    this.router.navigateByUrl('/settings');
    this.sharedService.setTabName('pane-D')
  }

  addNewSubSegment(){
    const modelRef = this.modalService.open(AddEditSubSegmentComponent, { centered: true, windowClass:'catreason-popup',backdrop: 'static', keyboard: false,backdropClass:'white' });
    const modelData = {};
    modelData["id"] = this.route.snapshot.params.id;
    modelRef.componentInstance.id = modelData;
    modelRef.result.then((result) => {
      if(result){
        this.getSubCategorySegmentData();
      }
    });
  }

  onEdit(v){
    const modelRef = this.modalService.open(AddEditSubSegmentComponent, { centered: true, windowClass:'catreason-popup',backdrop: 'static', keyboard: false,backdropClass:'white' });
    const modelData = {};
    modelData["name"] = v.name;
    modelData["category_id"] = v.categoryId;
    modelData["subSegmentId"] = v.id;
    modelData["isEdit"] = true;
    modelData["id"] = this.route.snapshot.params.id;
    modelRef.componentInstance.fromParent = modelData;
    modelRef.result.then((result)=>{
      if(result){
        this.getSubCategorySegmentData();
      }
    })
  }

  changeStatus(event,row) {
    const val = event.target.value;
    let categoryStatus = {};
    categoryStatus['status'] = val;
    this.settingService.changeSegmentSubCategoryStatus(row.id,categoryStatus)
        .subscribe((res) => {
          if (res.success) {
            this.global.successToastr(res.message);
          } else {
            this.global.errorToastr(res.message);
          }
        });
  }

}

import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingService} from '../../../shared/services/setting.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../shared/services/global.service';
import {SharedService} from '../../../shared/services/shared.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddEditCategoryComponent} from '../add-edit-category/add-edit-category.component';


@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {
  rows = [];
  selected = [];
  loadingIndicator = true;
  limitRow: Number = environment.adminlimitRow;
  count: any;
  selectFlag = false;
  subCategoryData;
  modalRef:any;
  status = [
    {label:'Inactive', value:'0'},
    {label: 'Active', value: '1'}];
  subReasonCategory = [
    {
      "id": "bfe2bd19-eb47-40ba-82ec-ddecbc4d22dd",
      "reason": "PAN Number does not match",
      "reasonId": "1",
      "status": 1
    },
    {
      "id": "28c0b39e-b203-4704-a6af-05e3b6afc9a4",
      "reason": "Address proof does not match with image",
      "reasonId": "1",
      "status": 1
    }
  ]
  constructor( private router: Router,
               private settingService: SettingService,
               private spinner: NgxSpinnerService,
               private route: ActivatedRoute,
               public global: GlobalService,
               private sharedService:SharedService,
               private modalService:NgbModal
               ) { }

  ngOnInit() {
    this.selectFlag = false;
    //this.subCategoryData = this.route.snapshot.data["category"];
    //if(this.subCategoryData.success){
    //  this.rows = [...this.subCategoryData.result['subReasonCategory']]
    //}
    this.rows = [...this.subReasonCategory]
  }

  changeStatus(event,row) {
    const val = event.target.value;
    let categoryStatus = {};
    categoryStatus['status'] = val;
    categoryStatus['id'] = row.id
    this.settingService.updateStatusReasonCategory(categoryStatus)
        .subscribe((res) => {
          if (res.success) {
            this.global.successToastr(res.message);
          } else {
            this.global.errorToastr(res.message);
          }
        });
  }

  setRouterLink(){
    this.router.navigateByUrl('/settings/admin-profile');
    this.sharedService.setTabName('pane-C')
  }

  addNewReason(){
    this.modalRef = this.modalService.open(AddEditCategoryComponent, { centered: true, windowClass:'catreason-popup',backdrop: 'static', keyboard: false,backdropClass:'white' });
    this.ngOnInit();
  }

  onEdit(v){
    const modelRef = this.modalService.open(AddEditCategoryComponent, { centered: true, windowClass:'catreason-popup',backdrop: 'static', keyboard: false,backdropClass:'white' });
    const modelData = {};
    modelData["reason"] = v.reason;
    modelData["reasonId"] = v.reasonId;
    modelData["id"] = v.id;
    modelData["isEdit"] = true;
    modelRef.componentInstance.fromParent = modelData;
    this.ngOnInit();
  }

}

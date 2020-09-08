import {Component, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {Router} from '@angular/router';
import {SettingService} from '../../../../shared/services/setting.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/global.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddEditSegmentComponent} from '../add-edit-segment/add-edit-segment.component';

@Component({
  selector: 'app-segment-list',
  templateUrl: './segment-list.component.html',
  styleUrls: ['./segment-list.component.scss']
})
export class SegmentListComponent implements OnInit {
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
   this.callApiSegment();
  }

  callApiSegment(){
    this.settingService.getSegmentCategory()
        .subscribe(
            Data => {
              if (Data.success) {
                this.temp = [...Data['result']['Items']];
                this.rows = Data['result']['Items'];
                this.spinner.hide();
              } else {
                this.spinner.hide();
                this.global.errorToastr(Data.message);
              }
            });
  }

  addNewSegment(){
    this.modalRef = this.modalService.open(AddEditSegmentComponent, { centered: true, windowClass:'catreason-popup',backdrop: 'static', keyboard: false,backdropClass:'white' });
    this.modalRef.result.then((result) => {
      if(result){
          this.callApiSegment();
      }
    });
  }

  onEdit(v){
    const modelRef = this.modalService.open(AddEditSegmentComponent, { centered: true, windowClass:'catreason-popup',backdrop: 'static', keyboard: false,backdropClass:'white' });
    const modelData = {};
    modelData["name"] = v.name;
    modelData["id"] = v.id;
    modelData["isEdit"] = true;
    modelRef.componentInstance.fromParent = modelData;
    modelRef.result.then((result)=>{
      if(result){
          this.callApiSegment();
      }
    })
  }

  onEditNavigate(v){
     this.router.navigateByUrl(`/settings/sub-segments/${v}`);
  }

  changeStatus(event,row) {
    const val = event.target.value;
    let segmentStatus = {};
    segmentStatus['status'] = val;
    this.settingService.updateStatusSegmentCategory(row.id,segmentStatus)
        .subscribe((res) => {
            if (res.success) {
                this.global.successToastr(res.message);
            } else {
                this.global.errorToastr(res.message);
            }
        });
    }

}

import {Component, OnInit, ViewChild} from '@angular/core';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {AdminService} from '../../../shared/services/admin.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-list-sub-admin',
  templateUrl: './list-admin.component.html',
  styleUrls: ['./list-admin.component.scss']
})
export class ListAdminComponent implements OnInit {

  rows = [];
  temp = [];
  selected = [];
  loadingIndicator = true;
  limitRow = '5';
  count:any;
  selectedItem;
  perPage = [
    { label: '10', value: '10' },
    { label: '15', value: '15' },
  ];
  footerMessage = {
  };


  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
      private router: Router,
      private adminService:AdminService,
      private spinner: NgxSpinnerService,
      private toasterService: ToastrService,
  ) { }



  ngOnInit(){
    this.adminService.getAdmins()
        .subscribe(
            Data => {
              if(Data.success){
                this.temp = [...Data['result']['userList']];
                this.rows = Data['result']['userList'];
                this.count = Data['result']['count'];
                this.spinner.hide();
              }else {
                this.spinner.hide();
                this.toasterService.error(Data.message);
              }
            });
  }

  onEdit(v){
    this.router.navigateByUrl('/admins/edit-admin/' + v);
  }

  onDelete(e,v){
    console.log("Delete data");
  }

  onSelect(row) {
    console.log(row)
    console.log(this.selected)
  }


    updateFilter(event) {
        const val = event.target.value.toLowerCase();
        this.rows = this.temp.filter((d) => {
            return d.email.toLowerCase().indexOf(val) !== -1 || !val ||
                d.mobileNumber.toLowerCase().indexOf(val) !== -1 || !val ||
                d.username.toLowerCase().indexOf(val) !== -1 || !val;
        });
        this.table.offset = 0;
    }

}

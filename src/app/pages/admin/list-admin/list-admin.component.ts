import {Component, OnInit, ViewChild} from '@angular/core';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {AdminService} from '../../../shared/services/admin.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ConfirmationDialogService} from '../../../shared/services/confirmation-dialoge.service';

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
  deleteFlag = false;
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
      private confirmationDialogService:ConfirmationDialogService
  ) { }



  ngOnInit(){
    this.deleteFlag = false;
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

  deleteAdmins() {
    if (this.selected.length > 0) {
      const id = [];
      this.selected.filter((data) => {
        id.push(data.id);
      })
      this.confirmationDialogService.confirm('Admins').then((data) => {
        if (data) {
          this.spinner.show();
          debugger;
          this.adminService.deleteAdmin({id: id})
              .subscribe((res) => {
                if (res.success) {
                  this.spinner.hide();
                  this.toasterService.success('Deleted Successfully')
                  this.ngOnInit();
                } else {
                  this.spinner.hide();
                  this.toasterService.error(res.message);
                }
              });
        }
      }).catch(error => console.log(error));
    }
  }

  onDelete(btnElement,id) {
    btnElement && btnElement.parentElement && btnElement.parentElement.parentElement &&
    btnElement.parentElement.parentElement.blur();
    this.confirmationDialogService.confirm('Admin').then((data)=>{
      if(data){
        this.spinner.show();
        this.adminService.deleteAdmin({id:[id]})
            .subscribe((res) => {
              if(res.success){
                this.rows = this.rows.filter(item => item.id != id);
                this.spinner.hide();
                this.toasterService.success('Deleted Successfully')
              }else{
                this.spinner.hide();
                this.toasterService.error(res.message);
              }
            });
      }
    }).catch( error =>  console.log(error));
  }

  onSelect(row) {
    this.deleteFlag = this.selected.length > 0;
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

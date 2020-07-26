import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AdminService } from '../../../shared/services/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationDialogService } from '../../../shared/services/confirmation-dialoge.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../shared/services/global.service';
import { environment } from '../../../../environments/environment';
import { isArray } from 'util';

@Component({
  selector: 'app-list-sub-admin',
  templateUrl: './list-admin.component.html',
  styleUrls: ['./list-admin.component.scss']
})
export class ListAdminComponent implements OnInit {
  @ViewChild('searchBytype') searchBytype: ElementRef;

  rows = [];
  temp = [];
  selected = [];
  loadingIndicator = true;
  limitRow: Number = environment.adminlimitRow;
  adminsSelectCount;
  count: any;
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
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private toasterService: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    public global: GlobalService
  ) { }



  ngOnInit() {
    this.deleteFlag = false;
    this.adminService.getAdmins()
      .subscribe(
        Data => {
          if (Data.success) {
            this.temp = [...Data['result']['userList']];
            this.rows = Data['result']['userList'];
            this.count = Data['result']['Count'];
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.global.errorToastr(Data.message);
          }
        });
  }

  onEdit(v) {
    this.router.navigateByUrl('/admins/edit-admin/' + v);
  }

  deleteAdmins() {
    if (this.selected.length > 0) {
      const id = [];
      this.selected.filter((data) => {
        id.push(data.id);
      });
      this.deleteConfirmServiceCall('Admins', id);
    }
  }

  onDelete(id) {
    this.deleteConfirmServiceCall('Admin', id);
  }

  deleteConfirmServiceCall(label, id) {
    let objParam = {};
    if (isArray(id)) {
      objParam['id'] = id;
    } else {
      objParam['id'] = [id];
    }
    this.confirmationDialogService.confirm(label).then((data) => {
      if (data) {
        this.spinner.show();
        this.adminService.deleteAdmin(objParam)
          .subscribe((res) => {
            if (res.success) {
              this.spinner.hide();
              this.global.successToastr(res.message);
              this.ngOnInit();
            } else {
              this.spinner.hide();
              this.global.errorToastr(res.message);
            }
          });
      }
    }).catch(error => console.log(error));
  }

  cancelAll() {
    // this.onSelect({ selected: [] });
    this.deleteFlag = false;
    this.selected = [];
    this.adminsSelectCount = 0;
  }
  /**
   * on select deselect event
   */
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    if (this.selected.length) {
      this.adminsSelectCount = this.selected.length;
      this.deleteFlag = this.selected.length > 0;
    } else {
      this.cancelAll();
    }
  }

  resetFilter($event) {
    if (!$event.target.value) {
      this.ngOnInit();
    }
  }

  updateFilter(event) {
    const searchBytype = this.searchBytype.nativeElement.value;
    if (!searchBytype) {
      this.global.errorToastr('Search box is empty')
    }
    const val = searchBytype.toLowerCase();
    this.rows = this.temp.filter((d) => {
      return d.email.toLowerCase().indexOf(val) !== -1 || !val ||
        d.mobileNumber.toLowerCase().indexOf(val) !== -1 || !val ||
        d.username.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.table.offset = 0;
  }

}

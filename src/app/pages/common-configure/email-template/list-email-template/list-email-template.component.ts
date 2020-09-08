import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { GlobalService } from 'app/shared/services/global.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConfigureService } from 'app/shared/services/global-configure.service';

@Component({
  selector: 'app-list-email-template',
  templateUrl: './list-email-template.component.html',
  styleUrls: ['./list-email-template.component.scss']
})
export class ListEmailTemplateComponent implements OnInit {
  // temp = [];
  rows = [];
  status = [
    { label: 'Inactive', value: '0' },
    { label: 'Active', value: '1' }];
  loadingIndicator = true;
  modalRef: any;
  limitRow: Number = environment.adminlimitRow;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    private router: Router,
    private globalConfigureService: GlobalConfigureService,
    public global: GlobalService,
  ) { }

  ngOnInit(): void {
    this.getAllEmailTemplates();
  }

  onEditNavigate(v) {
    this.router.navigateByUrl('/common-configure/edit-email-template/' + v);
  }

  getAllEmailTemplates() {
    this.globalConfigureService.getAllEmailTemplates()
      .subscribe((res) => {
        if (res.success) {
          if (res.result)
            // this.temp = [...res['result']];
            this.rows = res['result'];
        } else {
          this.global.errorToastr(res.message);
        }
      });
  }

}

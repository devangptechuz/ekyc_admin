import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('fileuploadAadharpopup') fileuploadAadharpopup: any;
  dashboardCount: any;
  newAppCount: any;
  userOnBoardindCount: any;
  applicationWithAlertMessages: any;
  inCompleteApplicationCount: any;
  userOnboardingCount: any;
  constructor(private modalService: NgbModal,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const dashboardCount = this.route.snapshot.data["dashboard"];
    if (dashboardCount.result) {
      const dashboardResult = dashboardCount.result;
      this.newAppCount = dashboardResult['userCount']['Count'];
      this.applicationWithAlertMessages = dashboardResult.applicationWithAlertMessages;
      this.inCompleteApplicationCount = dashboardResult.inCompleteApplicationCount;
      this.userOnboardingCount = dashboardResult.userOnboardingCount;
    }
    // console.log('this.dashboardCount', this.dashboardCount);
  }
  open() {
    this.modalService.open(this.fileuploadAadharpopup, { centered: true, size: 'lg', backdrop: 'static', keyboard: false });
  }

}

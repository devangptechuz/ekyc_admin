import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
@ViewChild('fileuploadAadharpopup') fileuploadAadharpopup: any;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }
  open(){
	 this.modalService.open(this.fileuploadAadharpopup, { centered: true, size: 'lg', backdrop: 'static', keyboard: false });
	}

}

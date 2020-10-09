import { Component, Input, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-querydetail-model',
  templateUrl: './querydetail-model.component.html'
})
export class QuerydetailModelComponent implements OnInit, AfterContentChecked {
  @Input() details: any;
  constructor(private activeModal: NgbActiveModal, private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

}

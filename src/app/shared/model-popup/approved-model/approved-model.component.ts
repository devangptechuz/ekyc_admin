import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-approved-model',
  templateUrl: './approved-model.component.html'
})
export class ApprovedModelComponent implements OnInit {
  @Input() title: string;
  @Input() label: string;
  @Input() selectedEntries: any;
  constructor(private activeModal: NgbActiveModal) { }

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

}

import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModelPopupComponent } from "../model-popup/model-popup.component";

@Component({
  selector: 'app-users-detail',
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.scss']
})
export class UsersDetailComponent implements OnInit {

  constructor(
      private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  addOnsModel(btnElement) {
    const modelRef = this.modelRef(btnElement);
    const modelData = {};
    modelData["title"] = "Add Ons";
    modelRef.componentInstance.fromParent = modelData;
  }

  modelRef(btnElement) {
    btnElement &&
    btnElement.parentElement &&
    btnElement.parentElement.parentElement &&
    btnElement.parentElement.parentElement.blur();
    return this.modalService.open(ModelPopupComponent, { centered: true });
  }

}

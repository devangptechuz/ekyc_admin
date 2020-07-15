import { Injectable } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeleteModelComponent} from '../model-popup/delete-model/delete-model.component';
import {LogoutPopupComponent} from '../model-popup/logout-popup/logout-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  constructor(private modalService: NgbModal) { }

  public confirm(label: string): Promise<boolean> {
    const modalRef = this.modalService.open(DeleteModelComponent, { centered: true });
    modalRef.componentInstance.label = label;
    return modalRef.result;
  }

  public deleteConfirm(name): Promise<boolean> {
    const modalRef = this.modalService.open(LogoutPopupComponent, { centered: true });
    modalRef.componentInstance.label = name;
    return modalRef.result;
  }

}

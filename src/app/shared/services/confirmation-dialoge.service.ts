import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModelComponent } from '../model-popup/delete-model/delete-model.component';
import { LogoutPopupComponent } from '../model-popup/logout-popup/logout-popup.component';
import { ApprovedModelComponent } from '../model-popup/approved-model/approved-model.component';
import { RejectModelComponent } from '../model-popup/reject-model/reject-model.component';
import { DeactivateModelComponent } from '../model-popup/deactivate-model/deactivate-model.component';
import { ActivateModelComponent } from '../model-popup/activate-model/activate-model.component';

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

  public deactivateAdminConfirm(label: string): Promise<boolean> {
    const modalRef = this.modalService.open(DeactivateModelComponent, { centered: true });
    modalRef.componentInstance.label = label;
    return modalRef.result;
  }

  public activateAdminConfirm(label: string): Promise<boolean> {
    const modalRef = this.modalService.open(ActivateModelComponent, { centered: true });
    modalRef.componentInstance.label = label;
    return modalRef.result;
  }

  public approveConfirm(label: string, ids: any = ''): Promise<boolean> {
    const modalRef = this.modalService.open(ApprovedModelComponent, { centered: true });
    modalRef.componentInstance.label = label;
    if (ids) {
      modalRef.componentInstance.selectedEntries = ids.length;
    }
    return modalRef.result;
  }

  public rejectConfirm(label: string, ids: any = ''): Promise<boolean> {
    const modalRef = this.modalService.open(RejectModelComponent, { centered: true });
    modalRef.componentInstance.label = label;
    if (ids) {
      modalRef.componentInstance.selectedEntries = ids.length;
    }
    return modalRef.result;
  }

  public deleteConfirm(name: any, userEmail: string): Promise<boolean> {
    const modalRef = this.modalService.open(LogoutPopupComponent, { centered: true });
    modalRef.componentInstance.label = name;
    modalRef.componentInstance.userEmail = userEmail;
    return modalRef.result;
  }

}

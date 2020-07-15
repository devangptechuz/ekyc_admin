import { Injectable } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeleteModelComponent} from '../delete-model/delete-model.component';

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

}

import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-image-popup',
  templateUrl: './image-popup.component.html',
  styleUrls: ['./image-popup.component.scss']
})
export class ImagePopupComponent implements OnInit {
  @Input() fromParent;
  title:any;
  userData:any;
  arrayOfString:any;
  imageString:any;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.title = this.fromParent.title;
    this.userData = this.fromParent.userData;
    this.arrayOfString = this.fromParent.arrayOfString;
    this.imageString = this.userData[this.arrayOfString[0]][this.arrayOfString[1]];

  }

  closeModal(sendData) {
    this.activeModal.close(sendData);
  }

  zoomin() {
    const myImg = document.getElementById("map");
    const currWidth = myImg.clientWidth;
    if (currWidth == 2500) return false;
    else {
      myImg.style.width = (currWidth + 100) + "px";
    }
  }

  zoomout() {
    const myImg = document.getElementById("map");
    const currWidth = myImg.clientWidth;
    if (currWidth == 100) return false;
    else {
      myImg.style.width = (currWidth - 100) + "px";
    }
  }

}

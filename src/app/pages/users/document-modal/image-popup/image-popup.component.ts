import { Component, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter, Input, AfterViewInit, ElementRef } from '@angular/core';
import { NgbModal, NgbModalRef, NgbActiveModal, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { CookiesService } from '@ngx-utils/cookies';
import { UserService } from 'app/shared/services/user.service';
import { GlobalService } from 'app/shared/services/global.service';
import { ActivatedRoute } from '@angular/router';
import panzoom from "panzoom";

@Component({
  selector: 'app-image-popup',
  templateUrl: './image-popup.component.html',
  styleUrls: ['./image-popup.component.scss'],
  providers: [NgbCarouselConfig]
})
export class ImagePopupComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<string>();
  @Input() nameOfDocument: string;
  @Input() nameTitleDocument: string;
  @Input() ipvDocStatus: string;
  @Input() aadhaarKYCDocuments: string;
  @Input() reviewAll: boolean;
  @Input() public showbutton1: boolean;
  @ViewChild('scene', { static: false }) scene: ElementRef;
  docUrl: string;
  docNameUrl: string;
  flag: boolean;
  userId: any;
  userData: any;
  adminApproval: any;
  globalDocumentPopup: boolean;
  interval: any;
  width = 700;
  height = 500;
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  addNewAadhaarImageUpload = true;
  public allowedMimeType;
  public mediaPreviews = [];
  aadharDisplayImage: any;
  maxUploadLimit = 1;
  selected;

  private modalRef: NgbModalRef;
  nameOfTitleDocument: any;
  isDocumentVerified: any;
  fileUploading: boolean;

  viewMediaPreviewsList: any;
  viewPreviewDisplayImage: any;
  viewSectionOfImage: boolean;
  panZoomController;
  zoomLevels: number[];
  currentZoomLevel: number;
  applicationType = [
    //   {
    //   id: '1',
    //   label: 'Aadhar Card',
    //   value:'aadhar_document'
    // },
    {
      id: '2',
      label: 'Pan Card',
      value: 'pan_document'
    }, {
      id: '3',
      label: 'Address Proof',
      value: 'address_proof'
    }, {
      id: '4',
      label: 'Signature',
      value: 'signature'
    }, {
      id: '5',
      label: 'Bank Statement',
      value: 'bank_statement'
    }, {
      id: '6',
      label: 'Cancelled Cheque',
      value: 'cancelled_cheque'
    }, {
      id: '7',
      label: 'Photograph',
      value: 'photograph'
    }]


  constructor(
    public global: GlobalService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private cookie: CookiesService,
    config: NgbCarouselConfig,
    private userService: UserService,
  ) {
    config.interval = 20000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }


  ngOnInit() {
    setTimeout(() => {
      if (this.reviewAll) {
        this.flag = true;
        this.selected = 'pan_document';
        this.setNameOfDoc('pan_document');
      } else {
        this.flag = false;
        this.setNameOfDoc(this.nameOfDocument);
      }
      this.globalDocumentPopup = true;
      this.userId = this.route.snapshot.params.id;
      this.setImages();
    }, 500)

  }

  async setImages() {
    this.onModalOpen();
    this.addNewDocumentImage();
    this.mediaPreviews = [];
    if (this.aadhaarKYCDocuments['documentStatus'] !== "not_uploaded") {
      this.userService.getUser(this.userId).subscribe((res: any) => {
        if (res.success) {
          this.userData = res.result
          this.fileUploading = false;
        }
      });
    }
  }


  doSelect(e) {
    this.setNameOfDoc(e);
    // this.setImages();
  }


  addNewDocumentImage() {
    this.uploader.progress = 0;
    this.addNewAadhaarImageUpload = true;
    this.viewSectionOfImage = false;
    this.viewMediaPreviewsList = [];
    this.viewPreviewDisplayImage = '';
  }


  cancelModal() {
    this.closeEvent.emit('imgDisplay');
  }

  onModalOpen() {
    this.uploader = new FileUploader({
      url: `${URL}api/uploadDocument`,
      disableMultipart: false, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      maxFileSize: 5 * 1024 * 1024,
      allowedMimeType: this.allowedMimeType,
      headers: [{ name: 'Authorization', value: this.cookie.get('admin_token') }],
    });
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
    this.response = '';
    this.uploader.response.subscribe(res => this.response = res);

    this.uploader.onBeforeUploadItem = (fileItem: any) => {
      fileItem.alias = 'file';
    }

    this.uploader.onWhenAddingFileFailed = (item, filter, options) => {
      this.onWhenAddingFileFailed(item, filter, options);
    }
    this.uploader.onAfterAddingFile = (fileItem) => {
      fileItem.withCredentials = false;
      const reader = new FileReader();
      reader.readAsDataURL(fileItem._file); // read file as data url
      reader.onload = async (event: any) => {
        this.mediaPreviews.push({ file: event.target.result, contentType: fileItem._file.type });
      }
    };
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      this.uploader.options.additionalParameter = {};
      this.uploader.options.additionalParameter['document_name'] = this.nameOfDocument;
    }
    this.uploader.onAfterAddingAll = (FileItem) => {
      setTimeout(() => {
        this.addNewAadhaarImageUpload = false;
        this.documentShowBigMedia(0);
      }, 1000);
    }
    this.uploader.onProgressItem = (fileItem: FileItem, progress: any) => {
      this.ref.detectChanges();
    }
    this.uploader.onErrorItem = (item, response, status, headers) => {
    }
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.onSuccessItem(item, response, status, headers);
    }
  }

  documentShowBigMedia(index, progress = false) {
    if (progress) {
      this.uploader.progress = 0;
    }
    this.addNewAadhaarImageUpload = false;
    this.mediaPreviews.filter((val, i) => {
      if (i == index) {
        this.aadharDisplayImage = val;
        return val;
      }
    });
  }

  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let data = JSON.parse(response);
    const imgageArray = { images: [data.result.token] };
  }

  onWhenAddingFileFailed(item: any, filter: any, options: any) {
    if (filter.name === 'queueLimit') {
      if (this.maxUploadLimit) {
        this.global.errorToastr(`You can upload max ${this.maxUploadLimit} Files.`);
      } else {
        this.global.errorToastr(`You have already uploaded 2 Files.`);
      }
      return false;
    } else {
      switch (filter.name) {
        case 'mimeType':
          let mimeErrorStatement = [];
          this.allowedMimeType.map((item) => {
            const mimeDisplyError = item.split("/");
            mimeErrorStatement.push(mimeDisplyError[1]);
          });
          this.global.errorToastr(`Please upload ${mimeErrorStatement.join(", ")} only.`);
          break;
        case 'fileSize':
          this.global.errorToastr('Image size must be less than 5mb.');
          break;
        default:
          this.global.errorToastr(`Unknown error (filter is ${filter.name})`);
      }
    }
  }

  close() {
    this.globalDocumentPopup = false;
    this.modalRef.close();
  }

  ngAfterViewInit(): void {
    this.zoomLevels = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];
    this.currentZoomLevel = this.zoomLevels[4];
    // this.panZoomController = panzoom(this.scene.nativeElement);
  }

  setNameOfDoc(name) {
    if (name === 'aadhar_document') {
      this.docNameUrl = 'aadhar_details';
      this.docUrl = 'aadhar_documents';
    } else if (name === 'pan_document') {
      this.docNameUrl = 'pan_details';
      this.docUrl = 'pan_documents';
    } else if (name === 'address_proof') {
      this.docNameUrl = 'personal_details';
      this.docUrl = 'permanent_address_url';
    } else if (name === 'cancelled_cheque') {
      this.docNameUrl = 'bank_details';
      this.docUrl = 'cancelled_cheque_url';
    } else if (name === 'signature') {
      this.docNameUrl = 'sign_and_identity';
      this.docUrl = 'sign_url';
    } else if (name === 'bank_statement') {
      this.docNameUrl = 'bank_details';
      this.docUrl = 'bank_statement_url';
    } else if (name === 'photograph') {
      this.docNameUrl = 'sign_and_identity';
      this.docUrl = 'photograph_url';
    }
  }

  zoom() {
    const isSmooth = false;
    const scale = this.currentZoomLevel;
    if (scale) {
      const transform = this.panZoomController.getTransform();
      const deltaX = transform.x;
      const deltaY = transform.y;
      const offsetX = scale + deltaX;
      const offsetY = scale + deltaY;
      if (isSmooth) {
        this.panZoomController.smoothZoom(0, 0, scale);
      } else {
        this.panZoomController.zoomTo(offsetX, offsetY, scale);
      }
    }
  }

  zoomToggle(zoomIn: boolean) {
    const idx = this.zoomLevels.indexOf(this.currentZoomLevel);
    if (zoomIn) {
      if (typeof this.zoomLevels[idx + 1] !== 'undefined') {
        this.currentZoomLevel = this.zoomLevels[idx + 1];
      }
    } else {
      if (typeof this.zoomLevels[idx - 1] !== 'undefined') {
        this.currentZoomLevel = this.zoomLevels[idx - 1];
      }
    }
    if (this.currentZoomLevel === 1) {
      this.panZoomController.moveTo(0, 0);
      this.panZoomController.zoomAbs(0, 0, 1);
    } else {
      this.zoom();
    }
  }
}

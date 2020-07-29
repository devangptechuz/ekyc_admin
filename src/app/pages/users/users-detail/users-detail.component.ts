import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbModalRef, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModelPopupComponent } from "../model-popup/model-popup.component";
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { Subject, Observable } from 'rxjs';
import { GlobalService } from 'app/shared/services/global.service';
import { UserService } from 'app/shared/services/user.service';
import { ActivatedRoute } from '@angular/router';
import {CookiesService} from '@ngx-utils/cookies';
import { ConfirmationDialogService } from 'app/shared/services/confirmation-dialoge.service';

@Component({
  selector: 'app-users-detail',
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.scss'],
  providers: [NgbCarouselConfig]
})
export class UsersDetailComponent implements OnInit {
  globalDocumentPopup: boolean;
  userKYCDocuments: any;
  userId: any;
  userData: any;
  aadhaarKYCDocuments: any;
  cancelledChequeKYCDocuments: any;
  ipvKYCDocuments: any;
  signatureKYCDocuments: any;
  panDocumentKYCDocuments: any;
  addressProofKYCDocuments: any;
  bankStatementKYCDocuments: any;
  photographKYCDocuments: any;
  dropdownDocumentList: any;
  defaultSelectedDocument: any;
  adminApproval: any;
  adminApprovalText: string;

  @ViewChild('fileuploadAadharpopup') fileuploadAadharpopup: any;
  @ViewChild('fileuploadSignaturepopup') fileuploadSignaturepopup: any;
  @ViewChild('ipvPopup') IPVPopup: any;
  ipvDocumentStatus: string;
  /******** webcame: START *******/
  liveWebcam = false;
  webCamMediaPriview: any;
  webCamMediaList: any = [];
  /******** webcame: END *******/

  /*******************  webcam code initialize: START ***************/
  fileUploading: boolean;
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: { ideal: 100 },
    height: { ideal: 316 }
  };
  public errors: WebcamInitError[] = [];
  // latest snapshot
  public webcamImage: WebcamImage = null;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  clickedWebcamPicture = false;
  /*******************  webcam code initialize: END ***************/
  /********************** IMAGE/FILE UPLOAD: START **********************/
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  addNewAadhaarImageUpload = true;
  uploadProgress = 0;

  public allowedMimeType = ['image/png'];
  public altMedia = [];
  public mediaPreviews = [];
  public mediaImages = [];
  aadharDisplayImage: any;
  maxUploadLimit = 2;

  viewSectionOfImage: boolean;
  viewPreviewDisplayImage: any;
  viewMediaPreviewsList: any;
  getPreviewDisplayImage: any;

  private modalRef: NgbModalRef;
  nameOfTitleDocument: any;
  nameOfDocument: any;
  isDocumentVerified: any;
  isContentTypePdf: boolean;
  /********************** IMAGE/FILE UPLOAD: END **********************/
  /********************** Signature PAD: START **********************/

  signatureWidth: any;
  points = [];
  signatureImage;
  isEnableSignaturePad: boolean;
  /********************** Signature PAD: END **********************/

  constructor(
    config: NgbCarouselConfig,
    private cookie: CookiesService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public global: GlobalService,
    private userService: UserService,
    private ref: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    config.interval = 20000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }


  ngOnInit(): void {
    this.userId = this.route.snapshot.params.id;
    const userData = this.route.snapshot.data['user'];
    if (userData?.result) {
      this.manageUserData(userData?.result);
    }
  }

  manageApplicationStatus(adminApproval: string = '') {
    this.adminApproval = adminApproval;
    this.adminApprovalText = adminApproval;
    console.log('test', this.adminApprovalText);
    if (this.adminApproval === 'Reject') {
      this.adminApprovalText = 'rejected';
    } else if (this.adminApproval === 'Approved') {
      this.adminApprovalText = 'approved';
    }
  }
  manageUserData(result: any = '') {
    this.userData = result;

    this.userKYCDocuments = result?.basic_info?.document_uploaded;
    this.adminApproval = result?.basic_info?.adminApproval;
    this.manageApplicationStatus(this.adminApproval);

    if (result?.basic_info?.document_uploaded) {
      result?.basic_info?.document_uploaded.map((item: any) => {
        if (item?.document_name === 'aadhar_document') {
          this.aadhaarKYCDocuments = item;
        } else if (item?.document_name === 'pan_document') {
          this.panDocumentKYCDocuments = item;
        } else if (item?.document_name === 'address_proof') {
          this.addressProofKYCDocuments = item;
        } else if (item?.document_name === 'cancelled_cheque') {
          this.cancelledChequeKYCDocuments = item;
        } else if (item?.document_name === 'signature') {
          this.signatureKYCDocuments = item;
        } else if (item?.document_name === 'bank_statement') {
          this.bankStatementKYCDocuments = item;
        } else if (item?.document_name === 'photograph') {
          this.photographKYCDocuments = item;
        } else if (item?.document_name === 'ipv') {
          this.ipvKYCDocuments = item;
        }
      });
    }
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

  /**
   * Set file uploader while open modal
   */
  onModalOpen() {
    this.uploader = new FileUploader({
      url: `${URL}api/uploadDocument`,
      disableMultipart: false, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      maxFileSize: 5 * 1024 * 1024,
      allowedMimeType: this.allowedMimeType,
      headers: [{ name: 'Authorization', value: this.cookie.get('admin_token') }],
      queueLimit: this.maxUploadLimit
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
      // console.log('error item', item);
      // console.log('error status', status);
      // this.onErrorItem(item, response, status, headers);
    }
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.onSuccessItem(item, response, status, headers);
    }
  }
  /***************** Image/File UPLOAD: START *********************/
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    console.log('imgageArray', response);
    let data = JSON.parse(response);
    const imgageArray = { images: [data.result.token] };
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let error = JSON.parse(response);
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

  /***************** Image/File UPLOAD: START *********************/
  /**
   * Add new image button clicked and then process
   */
  addNewDocumentImage() {
    this.uploader.progress = 0;
    this.addNewAadhaarImageUpload = true;
    this.clickedWebcamPicture = false;
    this.viewSectionOfImage = false;
    this.viewMediaPreviewsList = [];
    this.viewPreviewDisplayImage = '';
  }
  /**
   * Add new web cam button clicked and then process
   */
  addNewWebcamImage() {
    this.webCamMediaPriview = false;
    this.clickedWebcamPicture = true;
    this.liveWebcam = true;
  }

  /**
   * Display image preview
   * @param index
   */
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

  /**
   * Display Preview of File or Image
   * @param name
   */
  previewImageBig(index) {
    this.getPreviewDisplayImage = this.viewMediaPreviewsList.filter((val, i) => {
      return i == index;
    });
    this.viewPreviewDisplayImage = this.getPreviewDisplayImage[0];
  }

  /**
   * Remove image preview
   */
  removeAadhaarMedia(name: any) {
    this.addNewAadhaarImageUpload = true;
    this.uploader.queue[0].remove();
    this.mediaPreviews = this.mediaPreviews.filter((val, i) => {
      if (val.file != name) {
        return val;
      };
    });
  }

  /**
  * Remove image from db in preview list using id and document_name
  */
  removeViewSectionMedia(fileId: any) {
    const obj = { id: fileId, document_name: this.nameOfDocument };
    obj['userId'] = this.userId;
    this.userService.removeImageFileDocument(obj).subscribe((res: any) => {
      if (res.success) {
        this.viewMediaPreviewsList = res.result;
        if (this.viewMediaPreviewsList?.length) {
          this.viewPreviewDisplayImage = this.viewMediaPreviewsList[0];
          this.viewSectionOfImage = true;
          this.fileUploading = false;
        } else {
          this.fileUploading = false;
          this.viewSectionOfImage = false;
          this.viewMediaPreviewsList = [];
          this.addNewDocumentImage();
        }
        this.maxUploadLimit++;
        this.uploader.clearQueue();
        this.onModalOpen();
        this.getKYCDocumentsList(true, this.userId);
        this.global.successToastr(res.message);
      } else {
        this.global.errorToastr(res.message);
      }
      // this.viewMediaPreviewsList = this.viewMediaPreviewsList.filter((val, i) => {
      //   if (val.id != fileId) {
      //     return val.id != fileId;
      //   };
      // });
    });
  }

  /**
   * Open popup modal
   */
  openPopupModal() {
    this.globalDocumentPopup = true;
    const dropdownDocumentList = this.userKYCDocuments;
    this.defaultSelectedDocument = dropdownDocumentList[0].document_name;
    this.dropdownDocumentList = dropdownDocumentList.filter((ele: any) => ele.document_name !== 'ipv' && ele.document_name !== 'signature');
    this.documentSelection();
    this.modalRef = this.modalService.open(this.fileuploadAadharpopup, { centered: true, size: 'lg', backdrop: 'static', keyboard: false });
    this.modalRef.result.then((result) => {
      this.aadharDisplayImage = '';
      this.mediaPreviews = [];
      this.globalDocumentPopup = false;
      this.uploader.clearQueue();
    });
  }
  /**
   * select document options
   * @param nameOfDocument
   * @param nameOfModalTitle
   * @param documentStatus
   * @param allItem
   */
  documentSelection(selectedDoc: any = '') {
    if (selectedDoc) {
      const selValue = selectedDoc.document_name;
      this.selectDocProcess(selValue);
    } else {
      const selValue = this.userKYCDocuments[0].document_name;
      this.selectDocProcess(selValue);
    }
  }

  selectDocProcess(selValue: any) {
    this.userKYCDocuments.map((item: any) => {
      if (item.document_name === selValue) {
        this.allowedMimeType = item.mime_type;
        this.maxUploadLimit = item.remaining_count;
        this.isDocumentVerified = (item.document_status === 'verified') ? true : false;
        this.onModalOpen();
        this.nameOfDocument = item.document_name;
        this.nameOfTitleDocument = item.document_modal_title;
        this.addNewDocumentImage();
        this.aadharDisplayImage = '';
        this.mediaPreviews = [];
        this.uploader.clearQueue();
      }
    });
  }
  /**
   * Open Document upload modal (Dynamically setted)
   */
  openDocumentPopupModal(nameOfDocument: any, nameOfModalTitle: any, documentStatus = '', allItem: any = '') {
    this.allowedMimeType = allItem.mime_type;
    this.maxUploadLimit = allItem.remaining_count;
    this.isDocumentVerified = (documentStatus === 'verified') ? true : false;
    this.onModalOpen();
    this.nameOfDocument = nameOfDocument;
    this.nameOfTitleDocument = nameOfModalTitle;
    this.addNewDocumentImage();
    this.aadharDisplayImage = '';
    this.mediaPreviews = [];
    this.uploader.clearQueue();
    if (documentStatus !== "not_uploaded") {
      const objParam = { 'document_name': nameOfDocument };
      objParam['id'] = this.userId;
      this.userService.getDocumentDetails(objParam).subscribe((res: any) => {
        if (res.success) {
          this.fileUploading = false;
          this.manageResultAfterUploadingFiles(res.result, false);
        }
      });
    }
    this.modalRef = this.modalService.open(this.fileuploadAadharpopup, { centered: true, size: 'lg', backdrop: 'static', keyboard: false });
    this.modalRef.result.then((result) => {
      this.aadharDisplayImage = '';
      this.mediaPreviews = [];
      this.globalDocumentPopup = false;
      this.uploader.clearQueue();
    });
  }
  /**
   * Submit image/file to upload document
   */
  submitDocumentUploadModal() {
    let uploadParam: any = new FormData();
    // objParam['id'] = this.userId;
    uploadParam.append('id', this.userId);
    uploadParam.append('api_name', 'upload_user_document');
    uploadParam.append('document_name', this.nameOfDocument);
    this.uploader.queue.map((item: any, index) => {
      uploadParam.append('file[]', item._file);
    });
    // uploadParam.append('files', queue);
    this.fileUploadingProcessStarting();
    this.userService.uploadDocument(uploadParam).subscribe((result: any) => {
      if (result.type === 1 && result.loaded && result.total) {
        const percentDone = Math.round(100 * result.loaded / result.total);
        this.uploadProgress = percentDone;
      } else if (result.body) {
        this.fileUploading = false;
        if (result.body.success) {
          this.manageResultAfterUploadingFiles(result.body.result, true);
          this.modalRef.close();
        }
      }
    }, error => {
      this.fileUploading = false;
    });
  }

  /**
   * Submit Webcam upload images
   */
  submitWebCamUploadModal() {
    let realImageBlob = [];
    this.webCamMediaList.map((item: any, index) => {
      const blobImage = this.appendFileAndSubmit(item);
      realImageBlob.push(blobImage);
    });
    let uploadParam: any = new FormData();

    uploadParam.append('id', this.userId);
    uploadParam.append('api_name', 'upload_user_document');
    uploadParam.append('document_name', this.nameOfDocument);
    realImageBlob.map((item: any, index) => {
      console.log('item', item);
      uploadParam.append('file[]', item, `webcamimage${index}.jpeg`);
    });
    this.fileUploadingProcessStarting();
    this.userService.uploadDocument(uploadParam).subscribe((result: any) => {
      if (result.type === 1 && result.loaded && result.total) {
        const percentDone = Math.round(100 * result.loaded / result.total);
        this.uploadProgress = percentDone;
      } else if (result.body) {
        this.fileUploading = false;
        if (result.body.success) {
          this.manageResultAfterUploadingFiles(result.body.result, true);
          this.modalRef.close();
        }
      }
    }, error => {
      this.fileUploading = false;
    });
  }
  /**
   * File uploading process startind and manage modal UI(hide: webcam view, add new image view)
   */
  fileUploadingProcessStarting() {
    this.uploadProgress = 0;
    this.fileUploading = true;
    this.clickedWebcamPicture = false;
  }

  /**
   * Manage Result After Uploading FilesgetKYCDocumentsList
   * @param result
   */
  manageResultAfterUploadingFiles(result: any, getKYCDocumentsList: boolean = false) {
    this.viewMediaPreviewsList = result;
    this.viewPreviewDisplayImage = this.viewMediaPreviewsList[0];
    this.uploader.clearQueue();
    this.webCamMediaList = [];
    this.viewSectionOfImage = true;
    this.mediaPreviews = [];
    this.globalDocumentPopup = false;
    if (getKYCDocumentsList) {
      this.getKYCDocumentsList(true, this.userId);
    }
  }
  /**
   * Converimage from binary to blob image
   * @param imageAsDataUrl
   */
  appendFileAndSubmit(imageAsDataUrl: any) {
    // imageAsDataUrl = 'data:image/gif;base64,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';
    const ImageURL = imageAsDataUrl;
    const block = ImageURL.split(";");
    const contentType = block[0].split(":")[1];// In this case "image/gif"
    const realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."
    const blob = this.b64toBlob(realData, contentType);
    return blob;
  }

  b64toBlob(b64Data, contentType, sliceSize = 512) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;

  }

  handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  // public handleInitError(error: WebcamInitError): void {
  //   this.errors.push(error);
  // }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): any {
    // const webCamPriview = [];
    if (this.webCamMediaList?.length < 2) {
      this.webCamMediaList.push(webcamImage.imageAsDataUrl);
    } else {
      this.global.errorToastr('You can add max 2 Files');
      return true;
    }
  }

  /**
   * show webcam priview image
   * @param index
   */
  webCamShowMediaBig(index) {
    this.liveWebcam = false;
    this.webCamMediaPriview = this.webCamMediaList.filter((val, i) => {
      return i == index;
    });
  }

  /**
   * remove webcam image from webcal list
   */
  removeWebCamMedia(name: any) {
    this.liveWebcam = true
    this.webCamMediaList = this.webCamMediaList.filter((val, i) => {
      if (name != val) {
        return name != val;
      };
    });
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  enableWebcamPicture() {
    this.addNewAadhaarImageUpload = false;
    this.clickedWebcamPicture = true;
    this.liveWebcam = true;
    this.webCamMediaList = [];
  }

  /************* Document upload code: END ***************/

  /************* SIGNATURE DOCUMENT: START ***************/
  /**
   * Open Signature upload modal
   */
  openSinaturePopupModal(nameOfDocument: any, nameOfModalTitle: any, documentStatus = '', allItem: any = '') {
    this.allowedMimeType = allItem.mime_type;
    this.maxUploadLimit = allItem.remaining_count;
    this.isDocumentVerified = (documentStatus === 'verified') ? true : false;
    this.onModalOpen();
    this.webCamMediaList = [];
    this.signatureWidth = 300;

    this.nameOfDocument = nameOfDocument;
    this.nameOfTitleDocument = nameOfModalTitle;

    this.addNewDocumentImage();
    this.aadharDisplayImage = '';
    this.mediaPreviews = [];
    this.uploader.clearQueue();
    if (documentStatus !== "not_uploaded") {
      const objParam = { 'document_name': nameOfDocument };
      objParam['id'] = this.userId;
      this.userService.getDocumentDetails(objParam).subscribe((res: any) => {
        if (res.success) {
          this.fileUploading = false;
          this.manageResultAfterUploadingFiles(res.result, false);
        }
      });
    }
    this.modalRef = this.modalService.open(this.fileuploadSignaturepopup, { centered: true, size: 'lg', backdrop: 'static', keyboard: false });
    this.modalRef.result.then((result) => {
      this.globalDocumentPopup = false;
      this.aadharDisplayImage = '';
      this.mediaPreviews = [];
      this.uploader.clearQueue();
      this.isEnableSignaturePad = false;
    });
  }

  /***
   * Enable Signature pad
   */
  enableSignaturePad() {
    this.isEnableSignaturePad = true;
    this.viewSectionOfImage = false;
    this.fileUploading = false;
  }

  showImage(baseImage: any) {
    // console.log('data', baseImage);
    this.signatureImage = baseImage;
  }

  submitSignaturePadImageModal() {
    let realImageBlob = [];
    const blobImage = this.appendFileAndSubmit(this.signatureImage);
    realImageBlob.push(blobImage);

    // const queue = [];
    let uploadParam: any = new FormData();
    uploadParam.append('id', this.userId);
    uploadParam.append('api_name', 'upload_user_document');
    uploadParam.append('document_name', this.nameOfDocument);
    realImageBlob.map((item: any, index) => {
      uploadParam.append('file[]', item, `signatureimage${index}.jpeg`);
    });
    this.fileUploading = true;
    this.isEnableSignaturePad = false;
    this.userService.uploadDocument(uploadParam).subscribe((result: any) => {
      if (result.type === 1 && result.loaded && result.total) {
        const percentDone = Math.round(100 * result.loaded / result.total);
        this.uploadProgress = percentDone;
      } else if (result.body) {
        this.fileUploading = false;
        if (result.body.success) {
          this.viewMediaPreviewsList = result.body.result;
          this.viewPreviewDisplayImage = this.viewMediaPreviewsList[0];
          this.uploader.clearQueue();
          this.signatureImage = '';
          this.viewSectionOfImage = true;
          this.globalDocumentPopup = false;
          this.getKYCDocumentsList(true, this.userId);
          this.modalRef.close();
        }
      }
    }, error => {
      this.fileUploading = false;
    });
  }
  /************* SIGNATURE DOCUMENT: START ***************/

  /**
  * Get all document lists
  */
  getKYCDocumentsList(hideLoader: boolean = false, userId: any = '') {
    this.userService.getUserWithHideLoader(hideLoader, userId).subscribe((res: any) => {
      if (res.success) {
        // console.log(res.result);
        this.manageUserData(res.result);
      }
      if (hideLoader && res?.body?.success) {
        // console.log(res.body.result);
        this.manageUserData(res.body.result);
      }
    });
  }

  /************************** IN-PERSON-VIDEO:START **********************/
  /**
  * Open IPV upload modal (Dynamically setted)
  */
  openIPVPopupModal(nameOfDocument: any, nameOfModalTitle: any, documentStatus = '', allItem: any = '') {
    this.isDocumentVerified = (documentStatus === 'verified') ? true : false;
    this.nameOfDocument = nameOfDocument;
    this.nameOfTitleDocument = nameOfModalTitle;
    this.mediaPreviews = [];
    this.ipvDocumentStatus = documentStatus
    // if (documentStatus !== "not_uploaded") {
    //   const objParam = { 'document_name': nameOfDocument };
    //   this.dashboardService.getDocumentDetails(objParam).subscribe((res: any) => {
    //     if (res.success) {
    //       this.fileUploading = false;
    //       // this.manageResultAfterUploadingFiles(res.result, false);
    //     }
    //   });
    // }
    this.modalRef = this.modalService.open(this.IPVPopup, { centered: true, size: 'lg', backdrop: 'static', keyboard: false });
    this.modalRef.result.then((result) => {
      this.globalDocumentPopup = false;
      this.aadharDisplayImage = '';
      this.mediaPreviews = [];
    });
  }

  /**
   * submit aadhar upload and then close
   */
  cancelModal($event) {
    this.globalDocumentPopup = false;
    this.modalRef.close();
  }

  /**
   * approve confirm modal pop-up
   */
  approveConfirm() {
    const label = 'Application';
    let objParam = {}
    objParam['userIds'] = [this.userId];
    objParam['type'] = 'Approve';
    this.confirmationDialogService.approveConfirm(label).then((data) => {
      if (data) {
        this.userService.approveRejectApplication(objParam)
          .subscribe((res) => {
            if (res.success) {
              this.manageApplicationStatus('Approved');
              if (res.message) {
                this.global.successToastr(res.message);
              } else {
                this.global.successToastr('Approved Successfully');
              }
              // this.ngOnInit();
            } else {
              this.global.errorToastr(res.message);
            }
          });
      }
    }).catch(error => console.log(error));
  }

  /**
   * reject confirm modal pop-up
   */
  rejectConfirm() {
    const label = 'Application';
    let objParam = {}
    objParam['userIds'] = [this.userId];
    objParam['type'] = 'Reject';
    this.confirmationDialogService.rejectConfirm(label).then((data) => {
      if (data) {
        this.userService.approveRejectApplication(objParam)
          .subscribe((res) => {
            if (res.success) {
              this.manageApplicationStatus('Reject');
              if (res.message) {
                this.global.successToastr(res.message);
              } else {
                this.global.successToastr('Reject Successfully');
              }
              // this.ngOnInit();
            } else {
              this.global.errorToastr(res.message);
            }
          });
      }
    }).catch(error => console.log(error));
  }

}

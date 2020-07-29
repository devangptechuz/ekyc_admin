import { Component, OnInit, Output, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../shared/services/admin.service';
import { ValidationService } from '../../../shared/services/validator.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from '../../../shared/services/global.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  adminPasswordForm: FormGroup;
  adminProfileForm: FormGroup;
  inputvalue
  adminProfile = {};
  public allowedMimeType = ['image/png', 'image/jpeg', 'image/jpg'];
  fileUploading: boolean;
  @Output() done = new EventEmitter<any>();
  ipvDocumentStatus: string;
  @ViewChild('fileuploadAadharpopup') fileuploadAadharpopup: any;
  /******** webcame: START *******/
  liveWebcam = false;
  webCamMediaPriview: any;
  webCamMediaList: any = [];

  /********************** IMAGE/FILE UPLOAD: START **********************/
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  addNewAadhaarImageUpload = true;
  uploadProgress = 0;

  public altMedia = [];
  public mediaPreviews = [];
  public mediaImages = [];
  aadharDisplayImage: any;
  maxUploadLimit = 2;
  id: any;

  viewSectionOfImage: boolean;
  viewPreviewDisplayImage: any;
  viewMediaPreviewsList: any;
  getPreviewDisplayImage: any;

  private modalRef: NgbModalRef;
  nameOfTitleDocument: "Profile Update";
  nameOfDocument: any;
  isDocumentVerified: any;
  isContentTypePdf: boolean;
  /********************** IMAGE/FILE UPLOAD: END **********************/

  clickedWebcamPicture = false;
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  public errors: WebcamInitError[] = [];
  public allowCameraSwitch = true;
  public videoOptions: MediaTrackConstraints = {
    // width: { ideal: 100 },
    height: { ideal: 316 }
  };
  public deviceId: string;
  imageUrl: any;
  updatePasswordDate: any;
  updateProfileDate: any;
  userType: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private spinner: NgxSpinnerService,
    public global: GlobalService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.adminPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
    }, {
      validator: this.validationService.MatchPassword('password', 'confirm_password')
    });
    this.adminProfileForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required, this.validationService.mobileFormat]],
      email: ['', []],
      id: ['', []],
    });
    this.getProfileAdmin();
  }

  submitProfile() {
    if (!this.adminProfileForm.valid) {
      this.validationService.validateAllFormFields(this.adminProfileForm);
      return false;
    }
    delete this.adminProfileForm.value.id;
    delete this.adminProfileForm.value.email;
    this.adminService.updateAdminProfile(this.adminProfileForm.value).subscribe(
      (result: any) => {
        if (result.success) {
          this.global.successToastr(result.message);
          this.sharedService.setUsernameInfo(this.adminProfileForm.value.username);
          this.spinner.hide();
        } else {
          this.global.errorToastr(result.message);
        }
      });
  }

  getProfileAdmin() {
    this.adminService.getAdminProfile()
      .subscribe(
        Data => {
          if (Data.success) {
            this.adminProfile = Data['result']['userData'];
            this.adminProfileForm.patchValue(Data['result']['userData']);
            this.imageUrl = Data['result']['userData']['userProfile_url'];
            this.id = Data['result']['userData']['id'];
            this.userType = Data['result']['userData']['userType'];
            this.updateProfileDate = Data['result']['userData']['updateProfileDate'];
            this.updatePasswordDate = Data['result']['userData']['updatePasswordDate'];
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.global.errorToastr(Data.message);
          }
        });
  }
  onSubmit() {
    if (!this.adminPasswordForm.valid) {
      this.validationService.validateAllFormFields(this.adminPasswordForm);
      return false;
    }
    delete this.adminPasswordForm.value.confirm_password;
    this.adminService.updatePassword(this.adminPasswordForm.value).subscribe(
      (result: any) => {
        if (result.success) {
          this.global.successToastr(result.message);
          this.spinner.hide();
          this.adminPasswordForm.reset();
        } else {
          this.global.errorToastr(result.message);
        }
      });
  }

  openDocumentPopupModal() {
    this.addNewAadhaarImageUpload = true;
    this.onModalOpen();
    this.mediaPreviews = [];
    this.modalRef = this.modalService.open(this.fileuploadAadharpopup, { centered: true, size: 'lg', backdrop: 'static', keyboard: false });
  }

  onModalOpen() {
    this.uploader = new FileUploader({
      url: `${URL}api/uploadDocument`,
      disableMultipart: false, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      maxFileSize: 5 * 1024 * 1024,
      allowedMimeType: this.allowedMimeType,
      // headers: [{ name: 'Authorization', value: this.cookieService.get('admin_token') }],
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
    }
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.onSuccessItem(item, response, status, headers);
    }
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
    console.log('imgageArray', response);
    let data = JSON.parse(response);
    const imgageArray = { images: [data.result.token] };
  }

  removeWebCamMedia(name: any) {
    this.liveWebcam = true
    this.webCamMediaList = this.webCamMediaList.filter((val, i) => {
      if (name != val) {
        return name != val;
      };
    });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  addNewDocumentImage() {
    this.uploader.progress = 0;
    this.addNewAadhaarImageUpload = true;
    this.clickedWebcamPicture = false;
    this.viewSectionOfImage = false;
    this.viewMediaPreviewsList = [];
    this.viewPreviewDisplayImage = '';
  }

  webCamShowMediaBig(index) {
    this.liveWebcam = false;
    this.webCamMediaPriview = this.webCamMediaList.filter((val, i) => {
      return i == index;
    });
  }

  enableWebcamPicture() {
    this.addNewAadhaarImageUpload = false;
    this.clickedWebcamPicture = true;
    this.liveWebcam = true;
    this.webCamMediaList = [];
  }

  removeAadhaarMedia(name: any) {
    this.addNewAadhaarImageUpload = true;
    this.uploader.queue[0].remove();
    this.mediaPreviews = this.mediaPreviews.filter((val, i) => {
      if (val.file != name) {
        return val;
      };
    });
  }

  submitDocumentUploadModal() {
    let uploadParam: any = new FormData();
    uploadParam.append('api_name', 'update_profile');
    this.uploader.queue.map((item: any, index) => {
      uploadParam.append('file[]', item._file);
    });
    // uploadParam.append('files', queue);
    this.fileUploadingProcessStarting();
    this.adminService.updateAdminProfileImage(uploadParam).subscribe((result: any) => {
      if (result.type === 1 && result.loaded && result.total) {
        const percentDone = Math.round(100 * result.loaded / result.total);
        this.uploadProgress = percentDone;
      } else if (result.body) {
        this.imageUrl = result.body.result[0].url;
        this.sharedService.setImageUrl(result.body.result[0].url);
        this.fileUploading = false;
        if (result.body.success) {
          // this.manageResultAfterUploadingFiles(result.body.result, true);
          this.modalRef.close();

        }
      }

    }, error => {
      this.fileUploading = false;
    });
  }

  deleteImage() {
    this.spinner.show();
    this.adminService.deleteAdminProfile()
      .subscribe((res) => {
        if (res.success) {
          this.spinner.hide();
          this.global.successToastr(res.message);
          this.sharedService.setDeleteImageUrl(null);
          this.ngOnInit();
        } else {
          this.spinner.hide();
          this.global.errorToastr(res.message);
        }
      });
  }

  fileUploadingProcessStarting() {
    this.uploadProgress = 0;
    this.fileUploading = true;
    this.clickedWebcamPicture = false;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
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

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  cancelPopup() {
    this.addNewAadhaarImageUpload = true;
    this.modalRef.close();
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
  }

  removeViewSectionMedia(fileId: any) {
    const obj = { id: fileId, document_name: this.nameOfDocument };
  }

  previewImageBig(index) {
    this.getPreviewDisplayImage = this.viewMediaPreviewsList.filter((val, i) => {
      return i == index;
    });
    this.viewPreviewDisplayImage = this.getPreviewDisplayImage[0];
  }

  submitWebCamUploadModal() {
    let realImageBlob = [];
    this.webCamMediaList.map((item: any, index) => {
      const blobImage = this.appendFileAndSubmit(item);
      realImageBlob.push(blobImage);
    });
    let uploadParam: any = new FormData();
    uploadParam.append('api_name', 'update_profile');
    uploadParam.append('userProfile', this.nameOfDocument);
    realImageBlob.map((item: any, index) => {
      console.log('item', item);
      uploadParam.append('file[]', item, `webcamimage${index}.jpeg`);
    });
    this.fileUploadingProcessStarting();
    this.adminService.updateAdminProfileImage(uploadParam).subscribe((result: any) => {
      if (result.type === 1 && result.loaded && result.total) {
        const percentDone = Math.round(100 * result.loaded / result.total);
        this.uploadProgress = percentDone;
      } else if (result.body) {
        this.fileUploading = false;
        if (result.body.success) {
          this.imageUrl = result.body.result[0].url;
          this.sharedService.setImageUrl(result.body.result[0].url);
          // this.manageResultAfterUploadingFiles(result.body.result, true);
          this.modalRef.close();
        }
      }
    }, error => {
      this.fileUploading = false;
    });
  }

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
}

import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {Router} from '@angular/router';
import {SettingService} from '../../../../shared/services/setting.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalService} from '../../../../shared/services/global.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AddEditBrokerageCodeComponent} from '../add-edit-brokerage-code/add-edit-brokerage-code.component';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {Subject} from 'rxjs';
import {WebcamInitError} from 'ngx-webcam';

@Component({
  selector: 'app-brokerage-code-list',
  templateUrl: './brokerage-code-list.component.html',
  styleUrls: ['./brokerage-code-list.component.scss']
})
export class BrokerageCodeListComponent implements OnInit {
  temp = [];
  rows = [];
  status = [
    {label:'Inactive', value:'0'},
    {label: 'Active', value: '1'}];
  loadingIndicator = true;
  limitRow: Number = environment.adminlimitRow;
  formData;
  csvFile;
  inputvalue;
  public allowedMimeType = ['text/csv'];
  fileUploading: boolean;
  @Output() done = new EventEmitter<any>();
  ipvDocumentStatus: string;
  @ViewChild('fileUploadCsvPopup') fileUploadCsvPopup: any;

  /********************** IMAGE/FILE UPLOAD: START **********************/
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  addNewCsvUpload = true;
  uploadProgress = 0;

  public altMedia = [];
  public mediaPreviews = [];
  public mediaImages = [];
  maxUploadLimit = 1;
  aadharDisplayImage: any;
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

  public errors: WebcamInitError[] = [];
  public allowCameraSwitch = true;
  public videoOptions: MediaTrackConstraints = {
    height: { ideal: 316 }
  };
  public deviceId: string;
  imageUrl: any;
  updatePasswordDate: any;
  updateProfileDate: any;
  userType: any;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(private router: Router,
              private settingService: SettingService,
              private spinner: NgxSpinnerService,
              public global: GlobalService,
              private modalService:NgbModal,
              private ref: ChangeDetectorRef,
              ) { }

  ngOnInit(): void {
    this.callApiBrokerageCode();
  }

  callApiBrokerageCode(){
    this.settingService.getBrokerageMasterList()
        .subscribe(
            Data => {
              if (Data.success) {
                this.temp = [...Data['result']];
                this.rows = Data['result'];
              } else {
                this.global.errorToastr(Data.message);
              }
          });
  }

  addNewBrokerageCode(){
    this.modalRef = this.modalService.open(AddEditBrokerageCodeComponent, { centered: true, windowClass:'catreason-popup',backdrop: 'static', keyboard: false,backdropClass:'white' });
    this.modalRef.result.then((result) => {
      if(result){
        this.callApiBrokerageCode();
      }
    });
  }

  onEdit(v) {
    const modelRef = this.modalService.open(AddEditBrokerageCodeComponent, { centered: true, windowClass: 'catreason-popup', backdrop: 'static', keyboard: false, backdropClass: 'white' });
    const modelData = {};
    modelData["segmentCode"] = v.segmentCode;
    modelData["segmentCodeDescription"] = v.segmentCodeDescription;
    modelData["segmentCodeName"] = v.segmentCodeName;
    modelData["segmentCodeType"] = v.segmentCodeType;
    modelData["id"] = v.id;
    modelData["isEdit"] = true;
    modelRef.componentInstance.fromParent = modelData;
    modelRef.result.then((result) => {
      if (result) {
        this.callApiBrokerageCode();
      }
    })
  }

  changeStatus(event, row) {
    const val = event.target.value;
    let categoryStatus = {};
    categoryStatus['status'] = val;
    categoryStatus['segmentCode'] = row.segmentCode;
    this.settingService.changeBrokerageStatus(categoryStatus)
        .subscribe((res) => {
          if (res.success) {
            this.global.successToastr(res.message);
          } else {
            this.global.errorToastr(res.message);
          }
        });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.csvFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file)
    }else {
      this.csvFile = null;
    }
  }

  submitFile(){
    this.formData = new FormData();
    this.formData.append('filename', this.csvFile);
    this.formData.append('api_name', 'add_brokerage_csv');
    this.settingService.csvFileUpload(this.formData).subscribe(
        (result: any) => {
          if (result.success) {
            this.global.successToastr(result.message);
            this.callApiBrokerageCode();
          } else {
            this.global.errorToastr(result.message);
          }
        });
  }

  openDocumentPopupModal() {
    this.addNewCsvUpload = true;
    this.onModalOpen();
    this.mediaPreviews = [];
    this.modalRef = this.modalService.open(this.fileUploadCsvPopup, { centered: true, size: 'lg', backdrop: 'static', keyboard: false });
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
        this.addNewCsvUpload = false;
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
        default:
          this.global.errorToastr(`Unknown error (filter is ${filter.name})`);
      }
    }
  }

  documentShowBigMedia(index, progress = false) {
    if (progress) {
      this.uploader.progress = 0;
    }
    this.addNewCsvUpload = false;
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

  enableWebcamPicture() {
    this.addNewCsvUpload = false;
  }

  cancelPopup() {
    this.addNewCsvUpload = true;
    this.modalRef.close();
  }

  submitWebCamUploadModal() {
    let realImageBlob = [];
    let uploadParam: any = new FormData();
    uploadParam.append('api_name', 'update_profile');
    uploadParam.append('userProfile', this.nameOfDocument);
    realImageBlob.map((item: any, index) => {
      uploadParam.append('file[]', item, `webcamimage${index}.jpeg`);
    });
    this.fileUploadingProcessStarting();
    this.settingService.csvFileUpload(uploadParam).subscribe((result: any) => {
      if (result.type === 1 && result.loaded && result.total) {
        const percentDone = Math.round(100 * result.loaded / result.total);
        this.uploadProgress = percentDone;
      } else if (result.body) {
        this.fileUploading = false;
        if (result.body.success) {
          this.modalRef.close();
        }
      }
    }, error => {
      this.fileUploading = false;
    });
  }

  submitDocumentUploadModal() {
    let uploadParam: any = new FormData();
    uploadParam.append('api_name', 'add_brokerage_csv');
    this.uploader.queue.map((item: any, index) => {
      uploadParam.append('filename', item._file);
    });
    this.fileUploadingProcessStarting();
    this.settingService.csvFileUpload(uploadParam).subscribe((result: any) => {
      if (result.type === 1 && result.loaded && result.total) {
        const percentDone = Math.round(100 * result.loaded / result.total);
        this.uploadProgress = percentDone;
      } else if (result.body) {
        this.fileUploading = false;
        if (result.body.success) {
          this.modalRef.close();
        }
      }
    }, error => {
      this.fileUploading = false;
    });
  }

  fileUploadingProcessStarting() {
    this.uploadProgress = 0;
    this.fileUploading = true;
  }

  addNewDocumentImage() {
    this.uploader.progress = 0;
    this.addNewCsvUpload = true;
    this.viewSectionOfImage = false;
    this.viewMediaPreviewsList = [];
    this.viewPreviewDisplayImage = '';
  }

  removeAadhaarMedia(name: any) {
    this.addNewCsvUpload = true;
    this.uploader.queue[0].remove();
    this.mediaPreviews = this.mediaPreviews.filter((val, i) => {
      if (val.file != name) {
        return val;
      }
    });
  }

}

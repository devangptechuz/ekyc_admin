import { Component, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';

import * as RecordRTC from 'recordrtc/RecordRTC.min';
import * as ebml from 'ts-ebml';
import { MediaStreamRecorder } from 'recordrtc/RecordRTC.min';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import { CookiesService } from '@ngx-utils/cookies';
import { UserService } from 'app/shared/services/user.service';
import { GlobalService } from 'app/shared/services/global.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-in-person-video',
  templateUrl: './in-person-video.component.html',
  styleUrls: ['./in-person-video.component.scss']
})
export class InPersonVideoComponent implements OnInit, AfterViewInit {
  @Output() closeEvent = new EventEmitter<string>();
  @Input() nameDocument: string;
  @Input() nameTitleDocument: string;
  @Input() ipvDocStatus: string;
  userId: any;
  isVideoRecordingEnable: boolean;
  /*********************** IN PERSON VIDEO: START **************************/
  private stream: MediaStream;
  private recordRTC: any;
  is_user_address: boolean;
  modalReference: any;
  mediaConstraints: any;
  videoFlag: boolean;
  webcamVideo: boolean;
  albumId = '';
  albumUserId = '';
  isRecording: any;
  @ViewChild('video') video: any;
  isWebcame: boolean = true;
  canvasElement: any;
  videoContext: any;
  canvasStream: MediaStream;
  frontCamera: boolean;
  foundDevices: number;
  isRecorded: boolean;
  isMobileDevice: boolean;
  isIOS: any = false;
  iOSSafari: any = false;
  mediaId: string;
  isShowButton = false;
  isAllowLocation = true;
  isDisplayErrorMsg = true;
  isFileSelected: boolean;
  interval: any;
  duration: any;
  width = 700;
  height = 500;
  counter = 0;
  uploadVideo: any;
  uploadVideoBlob: any;
  videoSrc: any;
  /*********************** IN PERSON VIDEO: END **************************/

  /*********************** File Upload: START **************************/
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  addNewAadhaarImageUpload = true;
  uploadProgress = 0;
  public allowedMimeType = ['video/webm', 'video/mp4'];
  public altMedia = [];
  public mediaPreviews = [];
  public mediaImages = [];
  aadharDisplayImage: any;
  maxUploadLimit = 1;

  private modalRef: NgbModalRef;
  nameOfTitleDocument: any;
  nameOfDocument: any;
  isDocumentVerified: any;
  fileUploading: boolean;

  viewMediaPreviewsList: any;
  viewPreviewDisplayImage: any;
  viewSectionOfImage: boolean;
  /*********************** File Upload: END **************************/

  constructor(
    public global: GlobalService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private cookie: CookiesService,
    private userService: UserService,
  ) { }


  ngOnInit() {
    this.userId = this.route.snapshot.params.id;
    this.nameOfDocument = this.nameDocument;
    this.nameOfTitleDocument = this.nameTitleDocument;
    setTimeout(() => {
      this.onModalOpen();
    }, 500);
  }

  ngAfterViewInit() {

  }

  cancelModal() {
    this.videoSrc = '';
    if (this.stream) {
      const stream = this.stream;
      stream.getAudioTracks().forEach(track => track.stop());
      stream.getVideoTracks().forEach(track => track.stop());
    }
    this.isVideoRecordingEnable = false;
    this.closeEvent.emit('ipv');
  }

  /**
 * Set file uploader while open modal
 */
  onModalOpen() {
    if (this.ipvDocStatus !== 'not_uploaded') {
      const objParam = { id: this.userId, 'document_name': 'ipv' };
      this.userService.getDocumentDetails(objParam).subscribe((res: any) => {
        if (res.success) {
          this.viewMediaPreviewsList = res.result;
          this.viewPreviewDisplayImage = this.viewMediaPreviewsList[0];
          this.fileUploading = false;
          this.viewSectionOfImage = true;
        }
      });
    }
  }

  /**
   * To add new video
   */
  addNewVideo() {
    this.videoSrc = '';
    if (this.stream) {
      const stream = this.stream;
      stream.getAudioTracks().forEach(track => track.stop());
      stream.getVideoTracks().forEach(track => track.stop());
    }
    this.fileUploading = false;
    this.viewSectionOfImage = false;
    this.isVideoRecordingEnable = false;
  }

  play() {
    this.isVideoRecordingEnable = true;
    const video: any = this.video.nativeElement;
    video.muted = false;
    video.controls = false;
    video.autoplay = true;
    this.initialRecording();
  }

  /**
  *   on page load, displayed video camera by default
  */
  initialRecording() {
    this.interval = '';
    this.counter = 0;
    this.mediaConstraints = {
      video: {
        // mirrored: true,
        //facingMode: this.frontCamera ? "user" : "environment",
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: {
        echoCancellation: true
      }
    };
    navigator.mediaDevices
      .getUserMedia(this.mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  /* *
    = on click, start video recording
  ------------------------------------------------------ */
  startRecording() {
    if (this.isAllowLocation) {
      if (this.recordRTC) {
        try {
          this.isRecording = true;
          this.videoFlag = false;
          this.recordRTC.startRecording();
          /**
           * custom timer
           */
          this.interval = setInterval(() => {
            if (this.counter >= 0) {
              // console.log('this.counter', this.counter);
              if (this.counter >= 10) {
                this.stopRecording();
              } else {
                this.counter++;
              }
            }
          }, 1000);
        } catch (err) {
          this.isRecording = false;
          this.videoFlag = true;
          this.webcamVideo = false;
        }
      } else {
        this.errorCallback('');
      }
    }
  }


  /* *
     = stop video recording
   ------------------------------------------------------ */
  stopRecording() {
    this.isShowButton = false;
    this.isRecording = false;
    this.videoFlag = false;
    const recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processVideo.bind(this));
    // sets recorded video name and binary data
    recordRTC.getDataURL((dataURL: any) => {
      this.isRecorded = true;
      this.isFileSelected = false;
      // console.log('dataURL >>', dataURL);
      const dataString = dataURL.split('base64');
      // console.log('dataString[1]', dataString[1]);
      this.videoSrc = `data:video/webm;base64${dataString[1]}`;
    });

    const stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
    stream.getVideoTracks().forEach(track => track.stop());
    clearInterval(this.interval);
    this.isVideoRecordingEnable = false;
  }

  /**
     = redirect back to video listing screen
   ------------------------------------------------------ */
  redirectToVideoScreen(type: number) {
    // delete media if user wants to close video capture

    // this.actualRedirection();

  }

  /* *
     = toggle video control options
   ------------------------------------------------------ */
  toggleControls() {
    const video: HTMLVideoElement = this.video.nativeElement;
    video.muted = !video.muted;
    video.controls = !video.controls;
    video.autoplay = !video.autoplay;
  }

  /* *
     = start video recording stream
   ------------------------------------------------------ */
  successCallback(stream: MediaStream) {
    setTimeout(() => {
      this.isShowButton = true;
    }, 800);
    this.stream = stream;
    const video: HTMLVideoElement = this.video.nativeElement;
    video.srcObject = stream;
    video.muted = true;
    video.volume = 0;

    this.canvasElement = document.createElement('canvas');
    this.videoContext = this.canvasElement.getContext('2d');
    this.canvasElement.style =
      'position: absolute; top: 0; left: 0; opacity: 0; margin-top: -9999999999; margin-left: -9999999999; top: -9999999999; left: -9999999999; z-index: -1;';
    document.body.appendChild(this.canvasElement);
    this.canvasStream = this.canvasElement.captureStream();
    var audioPlusCanvasStream = new MediaStream();

    stream.getAudioTracks().forEach(track => {
      audioPlusCanvasStream.addTrack(track);
    });

    this.canvasStream.getVideoTracks().forEach(track => {
      audioPlusCanvasStream.addTrack(track);
    });

    // this.canvasStream.getAudioTracks().forEach(track => {
    //   audioPlusCanvasStream.addTrack(track);
    // });

    const options = {
      mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      checkForInactiveTracks: true,
      recorderType: MediaStreamRecorder,
      type: 'video'
    };

    this.recordRTC = RecordRTC(audioPlusCanvasStream, options);
    // this.recordRTuploadVideoC = RecordRTC(stream, options);
    var canvasPreview: any = document.getElementById('canvas-preview');
    if (this.canvasStream) {
      // canvasPreview.srcObject = this.canvasStream;
    }

    setInterval(() => {
      if (!this.recordRTC) return; // ignore/skip on stop-recording
      this.canvasElement.width = video.clientWidth;
      this.canvasElement.height = video.clientHeight;
      this.videoContext.clearRect(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      this.videoContext.save();
      this.videoContext.translate(this.canvasElement.width, 0);
      this.videoContext.scale(-1, 1);
      this.videoContext.drawImage(
        video,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      this.videoContext.setTransform(1, 0, 0, 1, 0, 0);
      this.videoContext.restore();
    }, 10);
  }

  /**
     = handle error here if any while capturing video
   ------------------------------------------------------ */
  errorCallback(error: any) {
    this.isRecording = false;
    this.videoFlag = true;
    this.webcamVideo = false;
    let customError = '';
    let displayError =
      'EyErne does not have access to your camera. To enable access, tap Setting and turn on Camera (with options Cancel - Settings). The EyE camera feature will not work unless the user provides camera access to EyErne.';
    if (error) {
      if (
        error.name == 'NotFoundError' ||
        error.name == 'DevicesNotFoundError'
      ) {
        customError = 'required track is missing';
      } else if (
        error.name == 'NotReadableError' ||
        error.name == 'TrackStartError' ||
        error.name === 'SourceUnavailableError'
      ) {
        customError = 'webcam or mic are already in use';
        displayError =
          'The EyE Camera is being used in a different device or browser where you are logged in. Please turn off the EyE Camera in all the other logged in devices or browsers to use EyE Camera on this device.';
      } else if (
        error.name == 'OverconstrainedError' ||
        error.name == 'ConstraintNotSatisfiedError'
      ) {
        customError = 'constraints can not be satisfied by avb. devices';
      } else if (
        error.name == 'NotAllowedError' ||
        error.name == 'PermissionDeniedError'
      ) {
        customError = 'permission denied in browser';
      } else if (error.name == 'TypeError' || error.name == 'TypeError') {
        customError = 'empty constraints object';
      } else {
        (customError = 'other errors :: '), error;
      }
    } else {
      (customError = 'else errors :: '), error;
    }

    // if (!this.iOSSafari && this.isIOS) {
    //   $('#fileSelectInput').trigger('click');
    //   //this.fileInput.nativeElement.click();
    // } else {
    this.global.errorToastr(displayError);
    // }
    setTimeout(() => {
      this.isShowButton = false;
    }, 800);
  }
  /**
     = process recorded video
   ------------------------------------------------------ */
  processVideo(audioVideoWebMURL) {
    const video: HTMLVideoElement = this.video.nativeElement;
    video.src = audioVideoWebMURL;
    const recordRTC = this.recordRTC;
    const recordedBlob = recordRTC.getBlob();
    this.uploadVideoBlob = recordedBlob; // set varibale to uploade webm file
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      this.duration = this.getSeekableWebmBlob(e.target.result);
    };
    fileReader.readAsArrayBuffer(recordedBlob);
  }

  /**
     = It returns duration from record rtc video
   ------------------------------------------------------ */
  getSeekableWebmBlob(buffer: ArrayBuffer) {
    const decoder = new ebml.Decoder();
    const reader = new ebml.Reader();
    reader.drop_default_duration = false;
    const elms = decoder.decode(buffer);
    elms.forEach(elm => {
      reader.read(elm);
    });
    const duration = reader.duration;
    reader.stop();
    return duration;
  }


  /* = Created Date: 30-10-2019
    = get address from geo location before adding media
  ------------------------------------------------------ */
  addMediaForPreview(dataURL: any, type: any) {
    console.log('dataURL <><>', dataURL);
    let mediaType = "";
    mediaType = "VIDEOS";
  }

  /******************************* VIDEO: END**********************/

  submitIPVDocumentPopup() {
    // this.global.warningToastr("In person video is under development process. We will update it soon");
    let realImageBlob = [];
    let uploadParam: any = new FormData();
    uploadParam.append('id', this.userId);
    uploadParam.append('api_name', 'upload_user_document');
    uploadParam.append('document_name', this.nameOfDocument);
    uploadParam.append('file[]', this.uploadVideoBlob, `recordedvideo.webm`);
    this.uploadProgress = 0;
    this.fileUploading = true;
    this.userService.uploadDocument(uploadParam).subscribe((result: any) => {
      if (result.type === 1 && result.loaded && result.total) {
        const percentDone = Math.round(100 * result.loaded / result.total);
        this.uploadProgress = percentDone;
      } else if (result.body) {
        this.fileUploading = false;
        if (result.body.success) {
          this.uploadVideoBlob = '';
          this.manageResultAfterUploadingFiles(result.body.result, true);
          this.closeEvent.emit();
        }
      }
    }, error => {
      this.fileUploading = false;
    });
  }

  /**
 * Remove image from db in preview list using id and document_name
 */
  removeViewSectionMedia(fileId: any) {
    const obj = { id: fileId, userId: this.userId, document_name: this.nameOfDocument };
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
          // this.getKYCDocumentsList(true);
        }
        this.global.successToastr(res.message);
      } else {
        this.global.errorToastr(res.message);
      }
    });
  }


  /**
  * Manage Result After Uploading FilesgetKYCDocumentsList
  * @param result
  */
  manageResultAfterUploadingFiles(result: any, getKYCDocumentsList: boolean = false) {
    this.viewMediaPreviewsList = result;
    this.viewPreviewDisplayImage = this.viewMediaPreviewsList[0];
    this.viewSectionOfImage = true;
    // if (getKYCDocumentsList) {
    //   this.getKYCDocumentsList();
    // }
  }

  /**
   * Get all document lists
   */
  getKYCDocumentsList(hideLoader: boolean = false) {
    this.userService.getDocumentAvailable(hideLoader).subscribe((res: any) => {
      // console.log('getDocumentAvailableList -- response', res);
      if (res.success) {
        // this.getDocumentAvailableList = res.result;
      }
      if (hideLoader && res?.body?.success) {
        // this.getDocumentAvailableList = res.body.result;
      }
    });
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
}

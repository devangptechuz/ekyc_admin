import { Component, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';

import { LayoutService } from '../../services/layout.service';
import { ConfigService } from '../../services/config.service';
import { CommonService } from "../../services/common.service";
import { ConfirmationDialogService } from '../../services/confirmation-dialoge.service';
import {SharedService} from '../../services/shared.service';
import {AdminService} from '../../services/admin.service';
import {GlobalService} from '../../services/global.service';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit, AfterViewInit {
  options = {
    direction: "ltr",
    bgColor: "black",
    transparentColor: "",
    bgImage: "assets/img/sidebar-bg/01.jpg",
    bgImageDisplay: true,
    compactMenu: false,
    sidebarSize: "sidebar-md",
    layout: "Light"
  };

  currentLang = "en";
  toggleClass = "ft-maximize";
  placement = "bottom-right";
  public isCollapsed = true;
  @Output()
  toggleHideSidebar = new EventEmitter<Object>();
  selectedBgColor: string = "black";
  isBgImageDisplay = true;

  public config: any = {};
  user: any;
  userName: any;
  userType: any;
  imageUrl: any;
  userEmail:any;

  constructor(
    private layoutService: LayoutService,
    private configService: ConfigService,
    private commonService: CommonService,
    private confirmationDialogService: ConfirmationDialogService,
    private sharedVarService:SharedService,
    private adminService:AdminService,
    public global: GlobalService,
  ) { }

  ngOnInit() {
    this.config = this.configService.templateConf;
    this.getProfileAdmin();
    this.sharedVarService.getUsernameInfo().subscribe((result) => {
      if(result && result !== ''){
        this.userName = result;
      }
    });
    this.sharedVarService.getImageUrl().subscribe((result) => {
      if(result && result !== ''){
        this.imageUrl = result;
      }
    });
    this.sharedVarService.getDeleteImageUrl().subscribe((result) => {
      if(result == null){
        this.imageUrl = result;
      }
    });
  }

  ngAfterViewInit() {
    if (this.config.layout.dir) {
      const dir = this.config.layout.dir;
      if (dir === "rtl") {
        this.placement = "bottom-left";
      } else if (dir === "ltr") {
        this.placement = "bottom-right";
      }
    }
  }

  ToggleClass() {
    if (this.toggleClass === "ft-maximize") {
      this.toggleClass = "ft-minimize";
    } else {
      this.toggleClass = "ft-maximize";
    }
  }

  toggleNotificationSidebar() {
    this.layoutService.emitChange(true);
  }

  toggleSidebar() {
    const appSidebar = document.getElementsByClassName("app-sidebar")[0];
    if (appSidebar.classList.contains("hide-sidebar")) {
      this.toggleHideSidebar.emit(false);
    } else {
      this.toggleHideSidebar.emit(true);
    }
  }

  onLogout(btnElement) {
    btnElement && btnElement.parentElement && btnElement.parentElement.parentElement &&
      btnElement.parentElement.parentElement.blur();
    this.confirmationDialogService.deleteConfirm(this.userName, this.userEmail).then((data) => {
      if (data) {
        this.commonService.logoutFromAdmin();
      }
    }).catch(error => console.log(error));
  }


  getProfileAdmin(){
    this.adminService.getAdminProfile()
        .subscribe(
            Data => {
              if(Data.success){
                this.imageUrl = Data['result']['userData']['userProfile_url'];
                this.userName = Data['result']['userData']['username'];
                this.userType = Data['result']['userData']['userType'];
                this.userEmail = Data['result']['userData']['email'];
              }else {
                this.global.errorToastr(Data.message);
              }
            });
  }

  onLayout() {
    if (this.options.layout === 'Dark') {
      this.onLightLayout();
    } else {
      this.onDarkLayout();
    }
  }
  darkBoolean = false;
  onDarkLayout() {
    this.options.layout = "Dark";
    this.options.bgColor = "black";
    this.selectedBgColor = "black";
    if (this.isBgImageDisplay) {
      this.options.bgImageDisplay = true;
    }
    this.layoutService.emitCustomizerChange(this.options);
  }

  onLightLayout() {
    this.options.layout = "Light";
    this.options.bgColor = "man-of-steel";
    this.selectedBgColor = "man-of-steel";
    if (this.isBgImageDisplay) {
      this.options.bgImageDisplay = true;
    }

    this.layoutService.emitCustomizerChange(this.options);
  }
}

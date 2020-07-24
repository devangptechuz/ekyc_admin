import { Component, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';

import { LayoutService } from '../../services/layout.service';
import { ConfigService } from '../../services/config.service';
import { CommonService } from "../../services/common.service";
import { ConfirmationDialogService } from '../../services/confirmation-dialoge.service';
import { CookieService } from 'ngx-cookie-service';

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

  constructor(
    private layoutService: LayoutService,
    private configService: ConfigService,
    private commonService: CommonService,
    private confirmationDialogService: ConfirmationDialogService,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.config = this.configService.templateConf;
    this.user = this.commonService.getLoggedInUser();
    this.userName = this.cookieService.get('admin_user_userName');
    this.userType = this.cookieService.get('admin_user_userType');
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
    let userEmail: string = this.cookieService.get('admin_user_email');
    btnElement && btnElement.parentElement && btnElement.parentElement.parentElement &&
      btnElement.parentElement.parentElement.blur();
    this.confirmationDialogService.deleteConfirm(this.userName, userEmail).then((data) => {
      if (data) {
        this.logout();
      }
    }).catch(error => console.log(error));
  }


  logout() {
    this.commonService.logout();
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
    // console.log('this.options.layout', this.options.layout);
    // this.darkBoolean = !this.darkBoolean;
    // console.log('this.options.layout', this.darkBoolean);
    // if (this.darkBoolean) {
    this.options.layout = "Dark";
    this.options.bgColor = "black";
    this.selectedBgColor = "black";
    if (this.isBgImageDisplay) {
      this.options.bgImageDisplay = true;
    }
    //emit event to FUll Layout
    this.layoutService.emitCustomizerChange(this.options);
    // }
    // } else {
    //   this.onLightLayout();
    // }
  }

  onLightLayout() {
    this.options.layout = "Light";
    this.options.bgColor = "man-of-steel";
    this.selectedBgColor = "man-of-steel";
    if (this.isBgImageDisplay) {
      this.options.bgImageDisplay = true;
    }

    //emit event to FUll Layout
    this.layoutService.emitCustomizerChange(this.options);
  }
}

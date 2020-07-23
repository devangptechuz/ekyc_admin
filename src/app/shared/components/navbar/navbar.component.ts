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
  currentLang = "en";
  toggleClass = "ft-maximize";
  placement = "bottom-right";
  public isCollapsed = true;
  @Output()
  toggleHideSidebar = new EventEmitter<Object>();

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
}

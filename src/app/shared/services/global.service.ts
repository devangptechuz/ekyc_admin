import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  language: any = this.cookie.get('browserLanguage') || 'en';
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private cookie: CookieService,
  ) { }


  /**
   * Delete multiple cookie as per passed array
   */
  deleteMultiCookies(cookieParams: any) {
    cookieParams.map((item: any) => {
      this.cookie.delete(item,'/');
    });
  }
  /**
   * get expired time or set expired time
   */
  getCookieExpiredTime() {
    const date = new Date();
    date.setTime(date.getTime() + (10 * 60 * 1000)); // for 10 minute
    // const time = date.getTime() + (60 * 60 * 1); // in hours
    return date;
  }

  /**
   * Error Toastr
   */
  errorToastr(message: any) {
    this.toastr.error(message, 'Error');
  }
  /**
   * Success Toastr
   */
  successToastr(message: any) {
    this.toastr.success(message, 'Success');
  }

  /**
   * Warning Toastr
   */
  warningToastr(message: any) {
    this.toastr.warning(message, 'Warning');
  }


  getCookieExpiredAuthTokenTime() {
    const date = new Date();
    date.setTime(date.getTime() + (8 * 60 * 60 * 1000)); // for Hours
    return date;
  }






  /**
   * Scroll up at zero level of window
   */
  onActivate() {
    window.scroll(0, 0);
  }



}

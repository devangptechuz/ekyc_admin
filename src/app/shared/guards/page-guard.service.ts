import { CanActivate, CanActivateChild, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../services/common.service';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class PageGuard implements CanActivate, CanActivateChild {
  constructor(
    public commonService: CommonService,
    private cookieService:CookieService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.check(route.data);
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.check(route.data);
  }

  check(data) {
    const token = this.cookieService.get('admin_user_token');
    if (token) {
     const tokenData = this.commonService.getDecodedAccessToken(token);
     if (tokenData) {
        return true;
     } else {
       this.commonService.goToHome();
       return false;
     }
    }
    this.commonService.goToHome();
    return false;
  }
}

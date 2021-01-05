import {CanActivate, CanActivateChild, ActivatedRouteSnapshot, Router} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../services/common.service';
import {CookiesService} from '@ngx-utils/cookies';


@Injectable()
export class PageGuard implements CanActivate, CanActivateChild {
  constructor(
    public commonService: CommonService,
    private cookies:CookiesService,
    public router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.check(route.data);
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.check(route.data);
  }

  check(data) {
    const token = this.cookies.get('admin_token');
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

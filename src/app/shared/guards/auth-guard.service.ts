import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,private cookieService:CookieService) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const token = this.cookieService.get('admin_user_token');
    if (!token) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}

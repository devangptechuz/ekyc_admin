import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {CookiesService} from '@ngx-utils/cookies';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,private cookies:CookiesService) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const token = this.cookies.get('admin_token');
    if (!token) {
      return true;
    }
    this.router.navigate(['/dashboard']);
    return false;
  }
}

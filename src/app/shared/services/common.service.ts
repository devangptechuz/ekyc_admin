import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

import { environment } from '../../../environments/environment';
import {GlobalService} from './global.service';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  apiUrl = environment.api_url;
  constructor(
    public http: HttpClient,
    public router: Router,
    public global: GlobalService,
    private cookieService:CookieService
  ) { }

  logout() {
    this.global.deleteMultiCookies(['admin_user_email', 'admin_user_token',
      'admin_user_userName', 'admin_user_userType']);
    this.router.navigate(['/login']);
  }

  login(data): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/adminlogin`, data);
  }

  register(data): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  forgotPassword(data): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgotPassword`, data);
  }

  resetPassword(data): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/resetPassword`, data);
  }

  setErrors(form, errorData) {
    for (const [key, value] of Object.entries(errorData)) {
      if (form.controls[key]) {
        form.controls[key].setErrors({
          serverError: value
        });
      }
    }
    return form;
  }

  goToHome() {
    const token = this.cookieService.get('admin_user_token');
    if (token) {
      return this.router.navigate(['/dashboard']);
    }
    return this.logout();
  }

  getLoggedInUser() {
    const token = localStorage.getItem('token');
    if (token) {
      return this.getDecodedAccessToken(token);
    }
    return;
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }


}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

import { environment } from '../../../environments/environment';
import {GlobalService} from './global.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  apiUrl = environment.api_url;
  constructor(
    public http: HttpClient,
    public router: Router,
    public global: GlobalService
  ) { }

  logout() {
    this.global.deleteMultiCookies(['admin_user_email', 'admin_user_token']);
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
    const token = localStorage.getItem('token');
    if (token) {
      return this.router.navigate(['/user']);
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

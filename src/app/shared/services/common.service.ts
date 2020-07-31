import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

import { environment } from '../../../environments/environment';
import { GlobalService } from './global.service';
import { CookiesService } from '@ngx-utils/cookies';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  apiUrl = environment.api_url;
  passwordStrength: any;
  passwordErrors: any;
  passwordMaintain = [
    { 'id': 1, 'message': 'Must contain at least 8 letters.' },
    { 'id': 2, 'message': 'Must contain at least one lowercase character(a-z).' },
    { 'id': 3, 'message': 'Must contain at least one uppercase character(A-Z).' },
    { 'id': 4, 'message': 'Must contain at least one special character(eg $).' },
    { 'id': 5, 'message': 'Must contain at least one digit(0-9).' },
  ];
  constructor(
    public http: HttpClient,
    public router: Router,
    public global: GlobalService,
    private cookies: CookiesService
  ) { }

  logout() {
    this.cookies.remove('admin_token');
    this.router.navigate(['/']);
  }

  logoutFromAdmin() {
    this.cookies.remove('admin_token');
    this.global.successToastr('Logout successfully');
    this.router.navigate(['/']);
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
    const token = this.cookies.get('admin_token');
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

  strength(event: any) {
    const password = event.target.value;
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    if (strongRegex.test(password)) {
      this.passwordStrength = 'strong';
    }
    else if (mediumRegex.test(password)) {
      this.passwordStrength = 'medium';
    }
    else if (password !== '') {
      this.passwordStrength = 'weak';
    } else {
      this.passwordStrength = '';
    }

    const lowerCaseRegex = new RegExp("^(?=.*[a-z])");
    const upperCaseRegex = new RegExp("^(?=.*[A-Z])");
    var p = password,
      passwordErrors = [];
    if (p.length < 8) {
      passwordErrors.push(1);
    }
    if (!lowerCaseRegex.test(password)) {
      passwordErrors.push(2);
    }
    if (!upperCaseRegex.test(password)) {
      passwordErrors.push(3);
    }
    if (p.search(/[*@!#$%&()^~{}]+/) < 0) {
      passwordErrors.push(4);
    }
    if (p.search(/[0-9]/) < 0) {
      passwordErrors.push(5);
    }
    if (password) {
      this.passwordMaintain.map((item: any) => {
        item['valid_password_type'] = true;
      });
    } else {
      this.passwordMaintain.map((item: any) => {
        item['valid_password_type'] = false;
      });
    }
    if ((passwordErrors.length > 0) && (password)) {
      this.passwordErrors = passwordErrors;
      this.passwordMaintain.map((item: any) => {
        if (passwordErrors.includes(Number(item.id))) {
          item['valid_password_type'] = false;
        }
      });
    } else {
      this.passwordErrors = [];
    }
  }

  progressBarCountOfPassword(passwordType: any = '') {
    switch (passwordType) {
      case "weak":
        return 33;
      case "medium":
        return 66;
      case "strong":
        return 100;
      default:
        return 0;
    }
  }


}

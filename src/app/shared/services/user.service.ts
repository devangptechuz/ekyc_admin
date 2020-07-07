import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = environment.api_url;
  constructor(
    public http: HttpClient,
    public router: Router,
  ) { }

  // Users Functions

  addUser(data) {
    return this.http.post<any>(`${this.apiUrl}/addUser`, data);
  }

  getUsers(params?) {
    return this.http.get<any>(`${this.apiUrl}/getUsers`, { params });
  }

  getUser(params?) {
    return this.http.get<any>(`${this.apiUrl}/getUserById`,{params});
  }

  upadteUser(id, data) {
    return this.http.put<any>(`${this.apiUrl}/updateUser`, data);
  }

  deleteUser(id) {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
  }

  activeInactiveUser(data) {
    return this.http.put<any>(`${this.apiUrl}/users/activeInactive`, data);
  }

  // Roles
  getRoles() {
    return this.http.get<any>(`${this.apiUrl}/roles`);
  }

}

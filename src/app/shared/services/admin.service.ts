import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    apiUrl = environment.api_url;
    constructor(
        public http: HttpClient,
        public router: Router,
    ) { }

    // Setting APIs

    getAdmins() {
        return this.http.get<any>(`${this.apiUrl}/adminUserList`);
    }

    getAdminProfile() {
        return this.http.get<any>(`${this.apiUrl}/adminProfile`);
    }

    getUserList() {
        return this.http.get<any>(`${this.apiUrl}/userList`);
    }

    addAdmin(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/insertSubAdmin`, data);
    }

    updatePassword(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/updatePassword`, data);
    }

    getUser(params?) {
        return this.http.get<any>(`${this.apiUrl}/getUserById`, { params });
    }

    getAdmin(id): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/adminDetail/${id}`);
    }

    updateAdmin(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/updateAdmin`, data);
    }

    deleteAdmin(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/deleteUser`, data); //todo id=['']
    }

}

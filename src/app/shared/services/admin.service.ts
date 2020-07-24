import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    apiUrl = environment.api_url;
    imageUrl = environment.imag_url;
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

    updateAdminProfile(data): Observable<any>{
        return this.http.post<any>(`${this.apiUrl}/updateAdminProfile`, data);
    }

    updateAdminProfileImage(data): Observable<any>{
        const params = new HttpParams().set('hideLoader', 'true');
        let options = { params: params };
        options['reportProgress'] = true;
        options['observe'] = 'events';
        return this.http.post<any>(`${this.imageUrl}/updateProfile`, data,options);
    }

    getUserList() {
        return this.http.get<any>(`${this.apiUrl}/userList`);
    }

    addAdmin(data): Observable<any> {
        return this.http.post<any>(`${this.imageUrl}/insertSubAdmin`, data);
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
        return this.http.post<any>(`${this.imageUrl}/updateAdmin`, data);
    }

    deleteAdmin(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/deleteUser`, data); //todo id=['']
    }

    deleteAdminProfile(): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/deleteUserProfile`); //todo id=['']
    }

}

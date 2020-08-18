import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SettingService {
    apiUrl_setting = environment.api_url_setting;
    constructor(
        public http: HttpClient,
        public router: Router,
    ) { }

    // Setting APIs

    getReasonCategory() {
        return this.http.get<any>(`${this.apiUrl_setting}/reasonCategory`);
    }

    getSubReasonListByReason(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/getSubReasonListByReason`,data);
    }

    sendReasonInfo(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/sendReasonInfo`,data);
    }

    getSubReasonCategory(id) {
        return this.http.get<any>(`${this.apiUrl_setting}/subReasonCategory/${id}`);
    }

    addSubReasonCategory(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/addSubReasonCategory`,data);
    }

    updateStatusReasonCategory(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/reasonStatus`,data);
    }

    updateSubReasonCategory(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/updateSubReasonCategory`,data);
    }



}

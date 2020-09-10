import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SettingService {
    apiUrl_setting = environment.api_url_setting;
    apiUrl_segment = environment.api_url_segment;
    imageUrl = environment.imag_url;
    constructor(
        public http: HttpClient,
        public router: Router,
    ) { }

    // Setting APIs

    getReasonCategory() {
        return this.http.get<any>(`${this.apiUrl_setting}/reasonCategory`);
    }

    getRecentAlerts() {
        return this.http.get<any>(`${this.apiUrl_setting}/getRecentAlert`);
    }

    getSubReasonListByReason(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/getSubReasonListByReason`, data);
    }

    sendReasonInfo(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/sendReasonInfo`, data);
    }

    getSubReasonCategory(id) {
        return this.http.get<any>(`${this.apiUrl_setting}/subReasonCategory/${id}`);
    }

    addSubReasonCategory(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/addSubReasonCategory`, data);
    }

    updateStatusReasonCategory(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/reasonStatus`, data);
    }

    updateSubReasonCategory(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/updateSubReasonCategory`, data);
    }

    getSegmentCategory() {
        return this.http.get<any>(`${this.apiUrl_setting}/getSegmentCategory`);
    }

    addSegmentCategory(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/addSegmentCategory`, data);
    }

    updateSegmentCategory(id, data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/updateSegmentCategory/${id}`, data);
    }

    updateStatusSegmentCategory(id, data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/updateStatusSegmentCategory/${id}`, data);
    }

    getSegmentSubCategory(id) {
        return this.http.get<any>(`${this.apiUrl_segment}/getSegmentSubCategory/${id}`);
    }

    addSegmentSubCategory(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/addSegmentSubCategory`, data);
    }

    updateSegmentSubCategory(id, data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_segment}/updateSegmentSubCategory/${id}`, data);
    }

    changeSegmentSubCategoryStatus(id, data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_segment}/changeSegmentSubCategoryStatus/${id}`, data);
    }

    getBrokerageMasterList(){
        return this.http.get<any>(`${this.apiUrl_segment}/getBrokerageMasterList`);
    }

    addSegmentPlans(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/addSegmentPlans`,data);
    }

    updateSegmentPlans(id,data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_segment}/updateSegmentPlans/${id}`,data);
    }

    getSegmentPlansList() {
        return this.http.get<any>(`${this.apiUrl_segment}/getSegmentPlansList`);
    }

    changeSegmentPlansStatus(id,data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_segment}/changeSegmentPlansStatus/${id}`,data);
    }

    addBrokerageMaster(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_segment}/addBrokerageMaster`,data);
    }

    updateBrokerageMaster(id,data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_segment}/updateBrokerageMaster/${id}`,data);
    }


    changeBrokerageStatus(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_segment}/changeBrokerageStatus`,data);
    }

    csvFileUpload(data): Observable<any> {
        const params = new HttpParams().set('hideLoader', 'true');
        let options = { params: params };
        options['reportProgress'] = true;
        options['observe'] = 'events';
        return this.http.post<any>(`${this.imageUrl}/commonUpload`, data, options);
    }
}

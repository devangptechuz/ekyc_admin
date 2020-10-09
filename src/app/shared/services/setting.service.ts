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
    reason_api_url = environment.reason_api_url;
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

    getQueryList(hideLoader: boolean = false) {
        let options = {};
        if (hideLoader) {
            const params = new HttpParams().set('hideLoader', 'true');
            let options = { params: params };
            options['reportProgress'] = true;
            options['observe'] = 'events';
        }
        return this.http.get<any>(`${this.reason_api_url}/getAllQueryList`, options);
    }

    readQueryByAdmin(id: any) {
        // return this.http.get<any>(`http://localhost:3000/test/api/readQueryByAdmin/${id}`);
        return this.http.get<any>(`${this.reason_api_url}/readQueryByAdmin/${id}`);
    }

    getSubReasonListByReason(data): Observable<any> {
        return this.http.post<any>(`${this.reason_api_url}/getSubReasonListWithOthersReason`, data);
    }

    sendReasonInfo(data): Observable<any> {
        // return this.http.post<any>(`http://localhost:3000/test/api/sendReasonInfo`, data);
        return this.http.post<any>(`${this.apiUrl_setting}/sendReasonInfo`, data);
    }

    saveRequestReview(data): Observable<any> {
        return this.http.post<any>(`${this.reason_api_url}/saveRequestReview`, data);
    }


    removeReasonOFUser(data: any) {
        // return this.http.post<any>(`http://localhost:3000/test/api/deleteRequestReason`, data);
        return this.http.post<any>(`${this.reason_api_url}/deleteRequestReason`, data);
    }

    /**
     * Send Reminder Vie Type of Method
     * @param objParam 
     */
    sendReminder(objParam: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/sendReminder`, objParam);
    }

    /**
     * Edit Update
     * @param objParam 
     */
    updateEmail(objParam: any, id: any): Observable<any> {
        return this.http.post<any>(`${this.reason_api_url}/changeUserEmail/${id}`, objParam);
    }

    getSubReasonCategory(id) {
        return this.http.get<any>(`${this.apiUrl_setting}/subReasonCategory/${id}`);
    }

    getSubReasonCategoryAll() {
        return this.http.get<any>(`${this.reason_api_url}/getSubReasonCategoryAll`);
    }

    /**
     * Get Reason list by sub category id
     * @param id 
     */
    getReasonListBySubCategory(id) {
        return this.http.get<any>(`${this.apiUrl_segment}/getSubReasonCategoryDetails/${id}`);
    }

    /**
     * Get All Reason list(Last reason text list : status = 1)
     */
    getAllReasonList() {
        return this.http.get<any>(`${this.apiUrl_segment}/getSubReasonCategoryDetails`);
    }

    /**
     * Get All Reason list(Last reason text list : status = 0,1)
     */
    getAllReasonCategoryList() {
        return this.http.get<any>(`${this.reason_api_url}/getAllReasonCategory`);
    }
    /**
     * Add reason main text 
     * @param data 
     */
    addReasonCategory(data): Observable<any> {
        return this.http.post<any>(`${this.reason_api_url}/addReasonCategory`, data);
        // return this.http.post<any>(`http://localhost:3000/test/api/addReasonCategory`, data);
    }
    /**
     * Add reason text 
     * @param data 
     */
    updateReasonCategory(id, data): Observable<any> {
        // return this.http.post<any>(`http://localhost:3000/test/api/updateReasonCategory/${id}`, data);
        return this.http.post<any>(`${this.reason_api_url}/updateReasonCategory/${id}`, data);
    }

    /**
     * Update Status of reason details
     */
    changeReasonCategoryStatus(data): Observable<any> {
        return this.http.post<any>(`${this.reason_api_url}/chnageReasonCategoryStatus`, data);
    }

    /**
     * Add reason text 
     * @param data 
     */
    addReason(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_segment}/addSubReasonCategoryDetails`, data);
    }

    /**
     * Add reason text 
     * @param data 
     */
    updateReason(id, data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_segment}/updateSubReasonCategoryDetails/${id}`, data);
    }
    /**
     * Update Status of reason details
     */
    updateStatuSubReasonCategoryDetails(id, data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_segment}/updateStatuSubReasonCategoryDetails/${id}`, data);
    }

    addSubReasonCategory(data): Observable<any> {
        // return this.http.post<any>(`http://localhost:3000/test/api/addSubReasonCategory`, data);
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

    getAllSegmentSubCategory() {
        return this.http.get<any>(`${this.reason_api_url}/getAllSubSegmentCategory`);
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

    getBrokerageMasterList() {
        return this.http.get<any>(`${this.apiUrl_segment}/getBrokerageMasterList`);
    }

    addSegmentPlans(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_setting}/addSegmentPlans`, data);
    }

    updateSegmentPlans(id, data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_segment}/updateSegmentPlans/${id}`, data);
    }

    getSegmentPlansList() {
        return this.http.get<any>(`${this.apiUrl_segment}/getSegmentPlansList`);
    }

    changeSegmentPlansStatus(id, data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_segment}/changeSegmentPlansStatus/${id}`, data);
    }

    addBrokerageMaster(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_segment}/addBrokerageMaster`, data);
    }

    updateBrokerageMaster(id, data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_segment}/updateBrokerageMaster/${id}`, data);
    }


    changeBrokerageStatus(data): Observable<any> {
        return this.http.post<any>(`${this.apiUrl_segment}/changeBrokerageStatus`, data);
    }

    csvFileUpload(data): Observable<any> {
        const params = new HttpParams().set('hideLoader', 'true');
        let options = { params: params };
        options['reportProgress'] = true;
        options['observe'] = 'events';
        return this.http.post<any>(`${this.imageUrl}/commonUpload`, data, options);
    }

    getDashboardCount() {
        // return this.http.get<any>(`http://localhost:3000/test/api/getDashboardCount`);
        return this.http.get<any>(`${this.reason_api_url}/getDashboardCount`);
    }

}

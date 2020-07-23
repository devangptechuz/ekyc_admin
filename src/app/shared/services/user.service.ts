import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Document } from '../../shared/models/document';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrlOfUser = environment.api_url

  constructor(
    public http: HttpClient,
    public router: Router
  ) { }

  getUserList() {
    return this.http.get<any>(`${this.baseUrlOfUser}/userList`);
  }

  getUser(id): Observable<any> {
    return this.http.get<any>(`${this.baseUrlOfUser}/userDetail/${id}`);
  }

  deleteUser(data): Observable<any> {
    return this.http.post<any>(`${this.baseUrlOfUser}/deleteUser`, data); //todo id=['']
  }
  /**
   * get ekyc document list 
   */
  getDocumentAvailable(hideLoader: boolean = false) {
    let options = {}
    if (hideLoader) {
      const params = new HttpParams().set('hideLoader', 'true');
      options = { params: params };
      options['reportProgress'] = true;
      options['observe'] = 'events';
    }
    return this.http.get<any>(`${this.baseUrlOfUser}/getKycDocuments`, options);
  }

  /**
   * Aadhar upload api
   */
  uploadDocument(obj: any) {
    const params = new HttpParams().set('hideLoader', 'true');
    let options = { params: params };
    options['reportProgress'] = true;
    options['observe'] = 'events';
    return this.http.post<any>(`https://rueleigzg6.execute-api.us-east-2.amazonaws.com/test/api/uploadUserDocuments`, obj, options);
  }

  /**
   * get document data from document_name 
   */
  getDocumentDetails(objParam: any): Observable<Document> {
    return this.http.post<any>(`${this.baseUrlOfUser}/getUserDocuments`, objParam);
  }

  /**
   * submit persoan & address details
   * @param objParam 
   */
  submitPersonalDetails(objParam: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrlOfUser}/submitPersonalDetails`, objParam);
  }

  /**
   * Remove Image/Files from DB
   */
  removeImageFileDocument(obj: any) {
    return this.http.post<any>(`${this.baseUrlOfUser}/deleteUserDocument`, obj);
  }

  getPersoanlAddressDetails(userId: string) {
    return this.http.get<any>(`${this.baseUrlOfUser}/getPersonalDetailsAndAddress/${userId}`);
  }

  /**
   * search bank details from ifsc_code
   * @param objParam 
   */
  searchBankeDetails(objParam: any) {
    return this.http.post<any>(`${this.baseUrlOfUser}/searchIfscCode`, objParam);
  }

  /**
   * submit bank details
   * @param objParam 
   */
  getBankDetails(userId: string) {
    return this.http.get<any>(`${this.baseUrlOfUser}/getBankDetails/${userId}`);
  }

  /**
   * submit bank details
   * @param objParam 
   */
  submitBankDetails(objParam: any) {
    return this.http.post<any>(this.baseUrlOfUser + `verifyBankDetails`, objParam);
  }

}

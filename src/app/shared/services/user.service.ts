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
  baseUrlOfUser = environment.api_url;
  imageUploadUrl = environment.imag_url;

  constructor(
    public http: HttpClient,
    public router: Router
  ) { }

  getUserList(byKey: any = '') {
    let obj = '';
    if (byKey) {
      obj = `application_status=${byKey}`;
      return this.http.get<any>(`${this.baseUrlOfUser}/userList?${obj}`);
    } else {
      return this.http.get<any>(`${this.baseUrlOfUser}/userList`);
    }
  }
  /**
   * get user details with loader 
   */
  getUser(id): Observable<any> {
    return this.http.get<any>(`${this.baseUrlOfUser}/userDetail/${id}`);
  }

  deleteUser(data): Observable<any> {
    return this.http.post<any>(`${this.baseUrlOfUser}/deleteUser`, data); //todo id=['']
  }

  approveRejectApplication(objParam: any) {
    return this.http.post<any>(`${this.baseUrlOfUser}/approveRejectApplication`, objParam); //todo id=['']
  }

  requestToApplicants(objParam: any) {
    return this.http.post<any>(`${this.baseUrlOfUser}/approveRejectApplication`, objParam); //todo id=['']
  }

  /**
   * get user details with hide loader 
   */
  getUserWithHideLoader(hideLoader: boolean = false, userId = null) {
    let options = {}
    if (hideLoader) {
      const params = new HttpParams().set('hideLoader', 'true');
      options = { params: params };
      options['reportProgress'] = true;
      options['observe'] = 'events';
    }
    return this.http.get<any>(`${this.baseUrlOfUser}/userDetail/${userId}`, options);
  }
  /**
   * get ekyc document list 
   */
  getDocumentAvailable(hideLoader: boolean = false, userId = null) {
    let options = {}
    if (hideLoader) {
      const params = new HttpParams().set('hideLoader', 'true');
      options = { params: params };
      options['reportProgress'] = true;
      options['observe'] = 'events';
    }
    return this.http.get<any>(`${this.baseUrlOfUser}/getKycDocuments/${userId}`, options);
  }

  /**
   * Aadhar upload api
   */
  uploadDocument(obj: any) {
    const params = new HttpParams().set('hideLoader', 'true');
    let options = { params: params };
    options['reportProgress'] = true;
    options['observe'] = 'events';
    return this.http.post<any>(`${this.imageUploadUrl}/commonUpload`, obj, options);
  }

  /**
   * get document data from document_name 
   */
  getDocumentDetails(objParam: any): Observable<Document> {
    return this.http.post<any>(`${this.baseUrlOfUser}/getUserDocuments`, objParam);
  }

  /**
   * Remove Image/Files from DB
   */
  removeImageFileDocument(obj: any) {
    return this.http.post<any>(`${this.baseUrlOfUser}/deleteUserDocument`, obj);
  }

  /**
   * submit persoan & address details
   * @param objParam 
   */
  submitPersonalDetails(objParam: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrlOfUser}/submitPersonalDetails`, objParam);
  }

  /**
   * get personal & address details
   * @param userId 
   */
  getPersonalAddressDetails(userId: string) {
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
    return this.http.post<any>(`${this.baseUrlOfUser}/submitBankDetails`, objParam);
  }

}

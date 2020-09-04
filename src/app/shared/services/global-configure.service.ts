import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalConfigureService {
  configure_api_url = environment.configure_api_url;
  imag_url = environment.imag_url;

  constructor(
    public http: HttpClient,
    public router: Router,
  ) { }

  // Setting APIs

  getAllConfiguration(hideLoader: boolean = false) {
    let options = {}
    if (hideLoader) {
      const params = new HttpParams().set('hideLoader', 'true');
      options = { params: params };
      options['reportProgress'] = true;
      options['observe'] = 'events';
    }
    return this.http.get<any>(`${this.configure_api_url}/getAllConfiguration`, options);
  }

  getAllConfigurationPromise(hideLoader: boolean = false): Promise<any> {
    let options = {}
    if (hideLoader) {
      const params = new HttpParams().set('hideLoader', 'true');
      options = { params: params };
      options['reportProgress'] = true;
      options['observe'] = 'events';
    }
    return this.http.get<any>(`${this.configure_api_url}/getAllConfiguration`, options).toPromise();
  }

  updateConfiguration(objParams: any) {
    return this.http.post<any>(`${this.configure_api_url}/updateConfiguration`, objParams);
  }

  /**
   * Update email configure
   * @param objParams 
   */
  submitEmailConfig(objParams: any) {
    return this.http.post<any>(`${this.imag_url}/commonUpload`, objParams);
  }

  getEmailConfigureData() {
    return this.http.get<any>(`${this.configure_api_url}/getEmailConfigureData`);
  }


}

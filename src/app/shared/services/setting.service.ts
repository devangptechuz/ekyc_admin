import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SettingService {
    apiUrl = environment.api_url;
    constructor(
        public http: HttpClient,
        public router: Router,
    ) { }

    // Setting APIs

    getProductTypes() {
        return this.http.get<any>(`${this.apiUrl}/product-types`);
    }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MeetupsService {
    apiUrl = environment.api_url;
    constructor(
        public http: HttpClient,
        public router: Router,
    ) { }

    // Meetup APIs

    addMeetup(data) {
        return this.http.post<any>(`${this.apiUrl}/meetups`, data);
    }

    updateMeetup(id, data) {
        return this.http.put<any>(`${this.apiUrl}/meetups/${id}`, data);
    }

    getMeetup(id) {
        return this.http.get<any>(`${this.apiUrl}/meetups/${id}`);
    }

    getMeetupListing(params) {
        return this.http.get<any>(`${this.apiUrl}/getMeetups`, { params });
    }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private userNameInfo: BehaviorSubject<any>;
  private imageUrl: BehaviorSubject<any>;
  private tanName: BehaviorSubject<any>;

  constructor() {
    this.userNameInfo = new BehaviorSubject<any>('');
    this.imageUrl = new BehaviorSubject<any>('');
    this.tanName = new BehaviorSubject<any>('');
  }

  getUsernameInfo(): Observable<any> {
    return this.userNameInfo.asObservable();
  }
  setUsernameInfo(newValue): any {
    this.userNameInfo.next(newValue);
  }

  getImageUrl(): Observable<any> {
    return this.imageUrl.asObservable();
  }
  setImageUrl(newValue): any {
    this.imageUrl.next(newValue);
  }

  setDeleteImageUrl(newValue): any {
    this.imageUrl.next(newValue);
  }
  getDeleteImageUrl(): Observable<any> {
    return this.imageUrl.asObservable();
  }

  getTabName(): Observable<any> {
    return this.tanName.asObservable();
  }
  setTabName(newValue): any {
    this.tanName.next(newValue);
  }
}

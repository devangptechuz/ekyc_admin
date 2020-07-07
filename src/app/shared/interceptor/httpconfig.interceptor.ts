import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(
    private spinner: NgxSpinnerService,
    private common: CommonService,
    private toaster: ToastrService,
  ) { }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinner.show();
    const token: string = localStorage.getItem('token');
    if (token) {
      if (
        request.url.search('/login') === -1 &&
        request.url.search('/socialLogin') === -1
      ) {
        request = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
      }
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.spinner.hide();
        }
        return event;
      }),
      catchError((err: HttpErrorResponse) => {
        this.spinner.hide();
        let errData;
        if (err instanceof HttpErrorResponse) {
          console.log('err', err);
          switch (err.status) {
            case 400:
              errData = err.error.error.errors ? err.error.error.errors : err.error.error;
              break;
            case 401:
              errData = err.error.message || err.error.error;
              this.handleAuthenticationError(errData);
              break;
            case 403:
              errData = err.error.error || 'Not allowed to access';
              this.toaster.error(errData);
              break;
            case 404:
              errData = err.error.result || err.error.error || err.error.message;
              this.toaster.error(errData);
              break;
            case 409:
              errData = err.error.error || err.error.message;
              this.toaster.error(errData);
              break;
            case 500:
              errData = err.error.result || err.error.error || err.error.message;
              this.toaster.error(errData);
              break;
            default:
              break;
          }
        }
        return throwError({ statusCode: err.status, error: errData ? errData : err });
      })
    );
  }

  handleAuthenticationError(error: any) {
    this.toaster.error(error)
    this.common.logout();
  }
}

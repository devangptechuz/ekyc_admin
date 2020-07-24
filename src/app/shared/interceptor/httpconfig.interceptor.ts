import { Injectable } from '@angular/core';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, merge, fromEvent, Observer } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common.service';
import { ToastrService } from 'ngx-toastr';
import {CookieService} from 'ngx-cookie-service';
import {GlobalService} from '../services/global.service';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(
    private spinner: NgxSpinnerService,
    private common: CommonService,
    private toaster: ToastrService,
    private cookieService: CookieService,
    public global: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.params.has('hideLoader')) {
      this.spinner.show();
    }
    request.params.set('hideLoader', '');
    const token: string = this.cookieService.get('admin_token');
    if (token) {
      if (request.url.search('/login') === -1) {
        request = request.clone({
          headers: request.headers.set('Authorization', `${token}`)
        });
      }
    }
    return next.handle(request).do(resp => {
      if (resp instanceof HttpResponse) {
        if (!resp.url.includes('hideLoader')) {
          this.onEnd();
          return resp;
        } else {
          return resp;
        }
      }
    }).catch(err => {
      // if (!resp.url.includes('hideLoader')) {
      //   this.onEnd();
      //   console.log('HIDE');
      // }
      this.onEnd();
      if (err instanceof HttpErrorResponse) {
        // console.log('err', err);
        switch (err.status) {
          case 401:
            if (err.error.message) {
              this.global.errorToastr(err.error.message);
            } else {
              this.global.errorToastr(err.error.error);
              this.handleAuthenticationError(err);
            }
            break;
          case 400:
            //console.log('error', err.error.error);
            if (err.status === 400 && err.error.message) {
              this.global.errorToastr(err.error.message);
            } else if (err.status === 400 && err.error.error == 'token_invalid') {
              this.global.errorToastr(err.error.error);
              this.handleAuthenticationError(err);
            } else if (err.status === 400 && err.error.error == 'token_not_provided') {
              this.global.errorToastr('Please signin with your credentials.');
              this.router.navigate(['login']); (err);
            } else if (err.status === 400 && err.error.status == 2) {
              this.toastr.warning(err.error.message, 'Error');
            } else if (err.status === 400 && err.error.status == 0) {
              this.global.errorToastr(err.error.message);
            } else {
              this.global.errorToastr(err.error.error);
            }
            break;
          case 404:
            if (err.status === 404 && err.error.error == 'user_not_found') {
              this.global.errorToastr(err.error.error);
            }
            break;
          case 422:
            if (err.status === 422 && err.error.error == 'invalid_credentials') {
              this.global.errorToastr(err.error.message);
            } else if (err.status === 422 && err.error.error == 'validation_failed') {
              this.global.errorToastr('Something went wrong with server, Please try again.');
            }
            break;
          case 704:
            if (err.status === 704) {
              this.global.errorToastr(err.error.error);
            }
            break;

          default:
            if (err.statusText === 'Unknown Error') {
              this.createOnline$().subscribe((isOnline) => {
                if (!isOnline) {
                  this.global.errorToastr('Internet Disconneted');
                } else {
                  this.global.errorToastr('Something went wrong with server, Please try again.');
                }
              });
            } else {
              this.global.errorToastr(err.error.message);
            }
            break;
        }
      }
      return Observable.throw(err);
    });

  }

  private onEnd(): void {
    this.spinner.hide();
  }


  createOnline$() {
    return merge<boolean>(
        fromEvent(window, 'offline').pipe(map(() => false)),
        fromEvent(window, 'online').pipe(map(() => true)),
        new Observable((sub: Observer<boolean>) => {
          sub.next(navigator.onLine);
          sub.complete();
        }));
  }

  handleAuthenticationError(error: any) {
    this.toaster.error(error)
    this.common.logout();
  }
}

import {
  HttpErrorResponse, HttpEvent, HttpHandler,
  HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((response: HttpErrorResponse) => {
        if (response) {
          if (response.status === 404) {
            this.router.navigateByUrl('/not-found');
          }
          if (response.status === 500) {
            const navExtras: NavigationExtras = {
              state: { error: response.error }
            };
            this.router.navigateByUrl('/server-error', navExtras);
          }
          if (response.status === 400) {
            if (response.error.errors) {
              throw response.error;
            }
            else {
              this.toastr.error(
                response.error.message,
                response.error.statusCode
              );
            }
          }
          if (response.status === 401) {
            this.toastr.error(response.error.message, response.error.statusCode);
          }
        }
        throw response;
      })
    );
  }
}

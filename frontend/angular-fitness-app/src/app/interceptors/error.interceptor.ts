import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, debounceTime, distinctUntilChanged, retry, switchMap, throwError, timeout } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      // Retry failed requests
      retry(3),
      // Set a maximum duration for the request
      timeout(30000),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
          return throwError(errorMessage);  // Rethrow client-side errors
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = `Bad Request: ${error.error.message}`;
              break;
            case 404:
              errorMessage = `Not Found: ${error.error.message}`;
              return throwError(error);  // Rethrow 404 errors
            case 500:
              errorMessage = `Internal Server Error: ${error.error.message}`;
              break;
            default:
              errorMessage = `Unknown Server Error: ${error.error.message}`;
          }
        }
      
        // Handle non-404 server-side errors
        window.alert(errorMessage);
        return throwError(errorMessage);
      })
    )
  }



  
}

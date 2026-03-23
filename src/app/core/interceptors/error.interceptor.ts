import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'An unexpected error occurred';
      
      if (error.error instanceof ErrorEvent) {
        errorMsg = `Error: ${error.error.message}`;
      } else {
        if (typeof error.error === 'string') {
          errorMsg = error.error;
        } else if (error.error && error.error.errors) {
          errorMsg = Object.values(error.error.errors).flat().join(' | ');
        } else if (error.error && error.error.message) {
          errorMsg = error.error.message;
        } else if (error.error && error.error.title) {
          errorMsg = error.error.title;
        } else {
          errorMsg = error.statusText || `Request failed (${error.status})`;
        }
        
        if (error.status === 401) {
             errorMsg = 'Session expired or unauthorized. Please sign in.';
        }
      }

      // Do not toast for 404s necessarily, depending on logic, but for now we toast all
      if (error.status !== 404) {
          toastService.error(errorMsg);
      }

      return throwError(() => error);
    })
  );
};

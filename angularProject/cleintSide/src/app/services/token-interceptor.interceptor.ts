import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core'; 
import { Router } from '@angular/router';

export const tokenInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router); 

  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError ((err : any) => {
      if (err instanceof HttpErrorResponse) {
        console.log(err.url);
        if (err.status === 401 || err.status === 403) {
          console.log('Unauthorized access detected. Redirecting...');
          if(router.url === '/'){

          } 
          else {
            localStorage.clear();
            router.navigate(['/'])
          }
        }
      }
      return throwError(() => err);
    })
  );
};

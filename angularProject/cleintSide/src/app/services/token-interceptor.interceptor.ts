import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core'; 
import { Router } from '@angular/router';
import { jwtDecode} from 'jwt-decode';  // Ensure you import jwtDecode

export const tokenInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router); 

  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      console.log(decoded);
      const currentTime = Math.floor(Date.now() / 1000);
      
      // If the token has expired, clear local storage and redirect to home
      if (decoded.exp < currentTime) {
        console.log('Token expired. Redirecting to login...');
        localStorage.clear();
        router.navigate(['/']);
        return throwError(() => new Error('Token expired'));
      }

      // Add token to request headers
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });

    } catch (error) {
      console.error('Invalid token. Redirecting...');
      localStorage.clear();
      router.navigate(['/']);
      return throwError(() => error);
    }
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 || err.status === 403) {
        console.log('Unauthorized access detected. Redirecting...');
        
        // Check if the user is already at the home screen to avoid unnecessary redirect
        if (router.url !== '/') {
          localStorage.clear();
          router.navigate(['/']); // Redirect to home/login screen
        }
      }

      return throwError(() => err);
    })
  );
};

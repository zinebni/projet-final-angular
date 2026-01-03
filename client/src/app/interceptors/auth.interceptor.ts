import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Interceptor to add auth token to requests and handle 401 errors (Unauthorized)
// will be used in app.module.ts providers array
// to protect routes and redirect to login on auth failure
// It retrieves the token from AuthService and appends it to the Authorization header

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();
  
  let authReq = req; // Clone the request to avoid mutating the original request
  //if token exists, add it to the request headers 
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  // Handle the request and catch 401 errors to log out and redirect to login
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout().subscribe();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};


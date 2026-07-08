import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthTokenStorage } from './auth-token.storage';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthTokenStorage).getToken();

  if (!token || request.url.includes('/api/auth')) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};

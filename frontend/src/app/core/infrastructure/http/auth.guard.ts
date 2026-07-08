import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthTokenStorage } from './auth-token.storage';

const canEnter = (): boolean => {
  const auth = inject(AuthTokenStorage);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const authGuard: CanActivateFn = () => canEnter();
export const authChildGuard: CanActivateChildFn = () => canEnter();

import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.fbUser$.pipe(
    take(1),
    map((user) => (user ? true : router.createUrlTree(['/login'])))
  );
};

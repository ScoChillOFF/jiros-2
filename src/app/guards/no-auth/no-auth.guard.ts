import { CanActivateFn } from '@angular/router';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const noAuthGuard: CanActivateFn = (route, state) => {
  return true;
};

import { ResolveFn } from '@angular/router';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const selectProjectResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};

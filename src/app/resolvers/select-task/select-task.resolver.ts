import { ResolveFn } from '@angular/router';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const selectTaskResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};

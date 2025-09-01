import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import 'cross-fetch/polyfill';

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

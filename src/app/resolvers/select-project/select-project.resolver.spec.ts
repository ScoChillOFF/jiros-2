import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { selectProjectResolver } from './select-project.resolver';

describe('selectProjectResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => selectProjectResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});

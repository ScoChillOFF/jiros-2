import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { selectTaskResolver } from './select-task.resolver';

describe('selectTaskResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => selectTaskResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});

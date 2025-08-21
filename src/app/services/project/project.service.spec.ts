import { TestBed } from '@angular/core/testing';

import { ProjectService } from './project.service';
import { AuthService } from '../auth/auth.service';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

const mockAuthService = {
  fbUser$: of({ uid: 'test-user-id' }),
};
const mockFirestore = {};

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProjectService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Firestore, useValue: mockFirestore },
      ],
    });
    service = TestBed.inject(ProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

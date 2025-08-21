import { TestBed } from '@angular/core/testing';

import { UserService } from './users.service';
import { of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Firestore } from '@angular/fire/firestore';

const mockAuthService = {
  fbUser$: of({ uid: 'test-user-id' }),
};
const mockFirestore = {};

describe('UsersService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Firestore, useValue: mockFirestore },
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { MemberService } from './members.service';
import { of } from 'rxjs';
import { ProjectService } from '../project/project.service';
import { UserService } from '../users/users.service';
import { Firestore } from '@angular/fire/firestore';

const mockProjectService = {
  currentProject$: of(null),
  currentProjectId$: of(null),
};

const mockUserService = {};
const mockFirestore = {};

describe('MembersService', () => {
  let service: MemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MemberService,
        { provide: ProjectService, useValue: mockProjectService },
        { provide: UserService, useValue: mockUserService },
        { provide: Firestore, useValue: mockFirestore },
      ],
    });
    service = TestBed.inject(MemberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

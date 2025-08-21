import { TestBed } from '@angular/core/testing';

import { TaskService } from './task.service';
import { of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ProjectService } from '../project/project.service';
import { Firestore } from '@angular/fire/firestore';

const mockAuthService = {
  fbUser$: of(null),
};

const mockProjectService = {
  currentProjectId$: of(null),
  currentProject$: of(null),
};

const mockFirestore = {};

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: ProjectService, useValue: mockProjectService },
        { provide: Firestore, useValue: mockFirestore },
      ],
    });
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

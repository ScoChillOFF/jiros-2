import {
  BehaviorSubject,
  combineLatest,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';
import { Project } from '../../models/project.interface';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docSnapshots,
  Firestore,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { projectConverter } from './project.converter';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private db = inject(Firestore);
  private auth = inject(AuthService);

  private readonly currentProjectId = new BehaviorSubject<string | null>(null);

  readonly currentProjectId$: Observable<string | null> =
    this.currentProjectId.asObservable();

  readonly myProjects$: Observable<Project[]> = this.auth.fbUser$.pipe(
    switchMap((fbUser) => {
      if (!fbUser) return of([]);
      const col = collection(this.db, 'projects').withConverter(
        projectConverter
      );
      const q = query(col, where('memberIds', 'array-contains', fbUser.uid));
      return collectionData(q);
    })
  );

  readonly currentProject$: Observable<Project | null> =
    this.currentProjectId.pipe(
      switchMap((id) => {
        if (!id) return of<Project | null>(null);
        const ref = doc(this.db, 'projects', id).withConverter(
          projectConverter
        );
        return docSnapshots(ref).pipe(
          map((snap) => (snap.exists() ? snap.data() : null))
        );
      })
    );

  readonly isProjectSelected$: Observable<boolean> = this.currentProjectId.pipe(
    map((id) => !!id)
  );

  readonly isOwner$: Observable<boolean> = combineLatest([
    this.currentProject$,
    this.auth.fbUser$,
  ]).pipe(
    map(
      ([project, fbUser]) =>
        !!project && !!fbUser && project.ownerId === fbUser.uid
    )
  );

  setCurrentProject(id: string | null): void {
    this.currentProjectId.next(id);
  }

  createProject$(name: string): Observable<Project> {
    return this.auth.fbUser$.pipe(
      take(1),
      switchMap((fbUser) => {
        if (!fbUser) throw new Error('Not authorized');
        const col = collection(this.db, 'projects').withConverter(
          projectConverter
        );

        const project: Omit<Project, 'id'> = {
          name,
          description: null,
          ownerId: fbUser.uid,
          memberIds: [fbUser.uid],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        return from(addDoc(col, project)).pipe(
          map((ref) => ({ ...project, id: ref.id }))
        );
      })
    );
  }

  getProject$(id: string): Observable<Project | null> {
    if (!id) return of<Project | null>(null);
    const ref = doc(this.db, 'projects', id).withConverter(projectConverter);
    return docSnapshots(ref).pipe(
      map((snap) => (snap.exists() ? snap.data() : null))
    );
  }

  updateProject$(id: string, patch: Partial<Project>): Observable<void> {
    const ref = doc(this.db, 'projects', id).withConverter(projectConverter);
    return from(updateDoc(ref, { ...patch, updatedAt: Date.now() }));
  }

  deleteProject$(id: string): Observable<void> {
    const ref = doc(this.db, 'projects', id);
    return from(deleteDoc(ref));
  }

  reset(): void {
    this.currentProjectId.next(null);
  }
}

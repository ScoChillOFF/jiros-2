import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable, of, combineLatest, from } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ProjectService } from '../project/project.service';
import { UserService } from '../users/users.service';
import { User } from '../../models/user.interface';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private db = inject(Firestore);
  private projects = inject(ProjectService);
  private users = inject(UserService);

  readonly ownerId$: Observable<string | null> =
    this.projects.currentProject$.pipe(map((p) => p?.ownerId ?? null));

  readonly memberIds$: Observable<string[]> =
    this.projects.currentProjectId$.pipe(
      switchMap((projectId) => {
        if (!projectId) return of([]);
        const col = collection(this.db, 'projects', projectId, 'members');
        return collectionData(col, { idField: 'id' }).pipe(
          map((rows) => rows.map((r) => r['id']))
        );
      })
    );

  readonly members$: Observable<User[]> = this.memberIds$.pipe(
    switchMap((ids) =>
      ids.length
        ? combineLatest(ids.map((id) => this.users.getUser$(id)))
        : of([])
    ),
    map((arr) => arr.filter((u) => u !== null))
  );

  isOwner$(userId: string): Observable<boolean> {
    return this.ownerId$.pipe(map((ownerId) => ownerId === userId));
  }

  addMember$(userId: string): Observable<void> {
    return this.projects.currentProjectId$.pipe(
      take(1),
      switchMap((projectId) => {
        if (!projectId) {
          throw new Error('No project selected');
        }
        const ref = doc(this.db, 'projects', projectId, 'members', userId);
        return from(setDoc(ref, { addedAt: Date.now() }));
      })
    );
  }

  removeMember$(userId: string): Observable<void> {
    return combineLatest([this.projects.currentProjectId$, this.ownerId$]).pipe(
      take(1),
      switchMap(([projectId, ownerId]) => {
        if (!projectId) {
          throw new Error('No project selected');
        }
        if (userId === ownerId) {
          throw new Error('Can not delete owner');
        }
        const ref = doc(this.db, 'projects', projectId, 'members', userId);
        return from(deleteDoc(ref));
      })
    );
  }
}

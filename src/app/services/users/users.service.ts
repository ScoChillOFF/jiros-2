import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  updateDoc,
  collection,
  docData,
  collectionData,
  query,
  orderBy,
  startAt,
  endAt,
  limit,
  arrayUnion,
  PartialWithFieldValue,
  arrayRemove,
} from '@angular/fire/firestore';
import { User as FbUser, UserCredential } from '@angular/fire/auth';
import { Observable, of, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { User } from '../../models/user.interface';
import { userConverter } from './user.converter';

@Injectable({ providedIn: 'root' })
export class UserService {
  private db = inject(Firestore);
  private auth = inject(AuthService);

  readonly currentUser$: Observable<User | null> = this.auth.fbUser$.pipe(
    switchMap((fbUser) => {
      if (!fbUser) return of(null);
      return this.getUser$(fbUser.uid);
    })
  );

  register$(email: string, password: string): Observable<User> {
    return this.auth
      .signUp(email, password)
      .pipe(
        switchMap((cred: UserCredential) => this.createUserProfile$(cred.user))
      );
  }

  private createUserProfile$(fbUser: FbUser): Observable<User> {
    const ref = doc(this.db, 'users', fbUser.uid).withConverter(userConverter);
    const profile: User = {
      id: fbUser.uid,
      email: fbUser.email ?? '',
      displayName: fbUser.displayName ?? null,
      photoURL: fbUser.photoURL ?? null,
      projects: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return from(setDoc(ref, profile, { merge: true })).pipe(map(() => profile));
  }

  login$(email: string, password: string): Observable<User | null> {
    return this.auth
      .signIn(email, password)
      .pipe(switchMap((cred: UserCredential) => this.getUser$(cred.user.uid)));
  }

  getUser$(uid: string): Observable<User | null> {
    const ref = doc(this.db, 'users', uid).withConverter(userConverter);
    return docData(ref).pipe(map((user) => user ?? null));
  }

  updateUser$(uid: string, patch: PartialWithFieldValue<User>): Observable<void> {
    const ref = doc(this.db, 'users', uid).withConverter(userConverter);
    return from(updateDoc(ref, { ...patch, updatedAt: Date.now() }));
  }

  addProjectToUser$(userId: string, projectId: string): Observable<void> {
    return this.updateUser$(userId, {projects: arrayUnion(projectId)})

  }

  removeProjectFromUser$(userId: string, projectId: string): Observable<void> {
    return this.updateUser$(userId, {projects: arrayRemove(projectId)})
  }

  listUsers$(): Observable<User[]> {
    const ref = collection(this.db, 'users').withConverter(userConverter);
    return collectionData(ref);
  }

  searchUsersByEmailPrefix$(term: string, max = 10): Observable<User[]> {
    const trimmed = term.trim();
    if (!trimmed) {
      return of([]);
    }

    const endChar = '\uf8ff';

    const col = collection(this.db, 'users').withConverter(userConverter);
    const q = query(
      col,
      orderBy('email'),
      startAt(trimmed),
      endAt(trimmed + endChar),
      limit(max)
    );

    return collectionData(q); 
  }
}

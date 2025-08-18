import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FbUser,
  UserCredential,
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { mapAuthError } from './auth-error.mapper';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  readonly fbUser$: Observable<FbUser | null> = authState(this.auth);

  signUp(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      catchError(mapAuthError)
    );
  }

  signIn(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      catchError(mapAuthError)
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(catchError(mapAuthError));
  }
}
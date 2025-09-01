import { FirebaseError } from '@angular/fire/app';
import { throwError } from 'rxjs';

function isFirebaseError(err: unknown): err is FirebaseError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof err.code === 'string'
  );
}

export function mapAuthError(err: unknown) {
  let code = '';
  let message = '';

  if (isFirebaseError(err)) {
    code = err.code;
  }

  switch (code) {
    case 'auth/email-already-in-use':
      message = 'Email already in use';
      break;
    case 'auth/invalid-email':
      message = 'Invalid email format';
      break;
    case 'auth/weak-password':
      message = 'Too weak password';
      break;

    case 'auth/user-not-found':
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      message = 'Incorrect email or/and password';
      break;

    case 'auth/too-many-requests':
      message = 'Too many attempts. Try again later';
      break;

    default:
      console.log(code);
      
      message = 'Unknown error has occured';
  }

  return throwError(() => new Error(message));
}

import {
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';
import { User } from '../../models/user.interface';

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User): DocumentData {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = user;
    return rest;
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User {
    const data = snapshot.data(options);
    if (!data) {
      throw new Error(`User document ${snapshot.id} does not exist`);
    }
    return {
      id: snapshot.id,
      email: data['email'] ?? '',
      displayName: data['displayName'] ?? null,
      photoURL: data['photoURL'] ?? null,
      projects: data['projects'] ?? [],
      createdAt: data['createdAt'] ?? Date.now(),
      updatedAt: data['updatedAt'] ?? Date.now(),
    };
  },
};

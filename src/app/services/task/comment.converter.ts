import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';

import { Comment } from '../../models/comment.interface';

export const commentConverter: FirestoreDataConverter<Comment> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toFirestore({ id, ...rest }: Comment): DocumentData {
    return rest;
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Comment {
    const data = snapshot.data(options);
    if (!data) {
      throw new Error(`Comment ${snapshot.id} missing`);
    }
    return {
      id: snapshot.id,
      authorId: data['authorId'] ?? 'unknown',
      message: data['message'] ?? '',
      createdAt: data['createdAt'] ?? Date.now(),
    };
  },
};

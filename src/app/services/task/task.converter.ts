import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  DocumentData,
} from '@angular/fire/firestore';
import { Task } from '../../models/task.interface';

export const taskConverter: FirestoreDataConverter<Task> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toFirestore({ id, ...rest }: Task): DocumentData {
    return rest;
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Task {
    const data = snapshot.data(options);
    if (!data) {
      throw new Error(`Task ${snapshot.id} missing`);
    }
    return {
      id: snapshot.id,
      title: data['title'] ?? 'untitled',
      description: data['description'] ?? null,
      status: data['status'] ?? 'todo',
      priority: data['priority'] ?? 'medium',
      creatorId: data['creatorId'] ?? 'unknown',
      assigneeId: data['assigneeId'] ?? null,
      dueDate: data['dueDate'] ?? null,
      createdAt: data['createdAt'] ?? Date.now(),
      updatedAt: data['updatedAt'] ?? Date.now(),
    };
  },
};

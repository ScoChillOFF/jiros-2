import {
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';
import { Project } from '../../models/project.interface';

export const projectConverter: FirestoreDataConverter<Project> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toFirestore({ id, ...rest }: Project): DocumentData {
    return rest;
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Project {
    const data = snapshot.data(options);
    if (!data) {
      throw new Error(`Project document ${snapshot.id} does not exist`);
    }
    return {
      id: snapshot.id,
      name: data['name'] ?? '',
      description: data['description'] ?? null,
      ownerId: data['ownerId'] ?? null,
      memberIds: data['memberIds'] ?? [],
      createdAt: data['createdAt'] ?? Date.now(),
      updatedAt: data['updatedAt'] ?? Date.now(),
    };
  },
};

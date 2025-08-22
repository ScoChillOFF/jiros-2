import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docSnapshots,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, combineLatest, from, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { ProjectService } from '../project/project.service';
import { Task, TaskPriority } from '../../models/task.interface';
import { Comment } from '../../models/comment.interface';
import { taskConverter } from './task.converter';
import { commentConverter } from './comment.converter';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private db = inject(Firestore);
  private auth = inject(AuthService);
  private projects = inject(ProjectService);

  private readonly currentTaskId = new BehaviorSubject<string | null>(null);

  readonly currentTaskId$ = this.currentTaskId.asObservable();

  readonly tasks$: Observable<Task[] | null> =
    this.projects.currentProjectId$.pipe(
      switchMap((projectId) => {
        if (!projectId) {
          return of(null);
        }
        const col = collection(
          this.db,
          'projects',
          projectId,
          'tasks'
        ).withConverter(taskConverter);
        const q = query(col, orderBy('createdAt', 'asc'));
        return collectionData(q);
      })
    );

  readonly currentTask$: Observable<Task | null> = combineLatest([
    this.projects.currentProjectId$,
    this.currentTaskId$,
  ]).pipe(
    switchMap(([projectId, taskId]) => {
      if (!projectId || !taskId) {
        return of(null);
      }
      const ref = doc(
        this.db,
        'projects',
        projectId,
        'tasks',
        taskId
      ).withConverter(taskConverter);
      return docSnapshots(ref).pipe(
        map((snap) => (snap.exists() ? snap.data() : null))
      );
    })
  );

  setCurrentTask(id: string | null): void {
    this.currentTaskId.next(id);
  }

  createTask$(input: {
    title: string;
    description?: string | null;
    priority?: TaskPriority;
    dueDate?: number | null;
    assigneeId?: string | null;
  }): Observable<Task> {
    return combineLatest([
      this.projects.currentProjectId$,
      this.auth.fbUser$,
    ]).pipe(
      take(1),
      switchMap(([projectId, fbUser]) => {
        if (!projectId) {
          throw new Error('No project selected');
        }
        if (!fbUser) {
          throw new Error('Not authorized');
        }

        const col = collection(
          this.db,
          'projects',
          projectId,
          'tasks'
        ).withConverter(taskConverter);
        const now = Date.now();

        const task: Omit<Task, 'id'> = {
          title: input.title,
          description: input.description ?? null,
          status: 'todo',
          priority: input.priority ?? 'medium',
          creatorId: fbUser.uid,
          assigneeId: input.assigneeId ?? null,
          dueDate: input.dueDate ?? null,
          createdAt: now,
          updatedAt: now,
        };

        return from(addDoc(col, task)).pipe(
          map((ref) => ({ ...task, id: ref.id }))
        );
      })
    );
  }

  updateTask$(taskId: string, patch: Partial<Task>): Observable<void> {
    return this.projects.currentProjectId$.pipe(
      take(1),
      switchMap((projectId) => {
        if (!projectId) {
          throw new Error('No project selected');
        }
        const ref = doc(
          this.db,
          'projects',
          projectId,
          'tasks',
          taskId
        ).withConverter(taskConverter);
        return from(updateDoc(ref, { ...patch, updatedAt: Date.now() }));
      })
    );
  }

  assignTask$(taskId: string, userId: string | null): Observable<void> {
    return this.updateTask$(taskId, { assigneeId: userId });
  }

  deleteTask$(taskId: string): Observable<void> {
    return this.projects.currentProjectId$.pipe(
      take(1),
      switchMap((projectId) => {
        if (!projectId) {
          throw new Error('No project selected');
        }
        const ref = doc(this.db, 'projects', projectId, 'tasks', taskId);
        return from(deleteDoc(ref));
      })
    );
  }

  listComments$(taskId: string): Observable<Comment[] | null> {
    return this.projects.currentProjectId$.pipe(
      switchMap((projectId) => {
        if (!projectId || !taskId) {
          return of(null);
        }
        const col = collection(
          this.db,
          'projects',
          projectId,
          'tasks',
          taskId,
          'comments'
        ).withConverter(commentConverter);
        const q = query(col, orderBy('createdAt', 'desc'));
        return collectionData(q);
      })
    );
  }

  addComment$(taskId: string, message: string): Observable<Comment> {
    return combineLatest([
      this.projects.currentProjectId$,
      this.auth.fbUser$,
    ]).pipe(
      take(1),
      switchMap(([projectId, fbUser]) => {
        if (!projectId) {
          throw new Error('No project selected');
        }
        if (!fbUser) {
          throw new Error('Not authorized');
        }

        const col = collection(
          this.db,
          'projects',
          projectId,
          'tasks',
          taskId,
          'comments'
        ).withConverter(commentConverter);

        const comment: Omit<Comment, 'id'> = {
          authorId: fbUser.uid,
          message,
          createdAt: Date.now(),
        };

        return from(addDoc(col, comment)).pipe(
          map((ref) => ({ ...comment, id: ref.id }))
        );
      })
    );
  }

  getTask$(taskId: string): Observable<Task | null> {
    return this.projects.currentProjectId$.pipe(
      switchMap((projectId) => {
        if (!projectId || !taskId) return of<Task | null>(null);
        const ref = doc(
          this.db,
          'projects',
          projectId,
          'tasks',
          taskId
        ).withConverter(taskConverter);
        return docSnapshots(ref).pipe(
          map((snap) => (snap.exists() ? snap.data() : null))
        );
      })
    );
  }
}

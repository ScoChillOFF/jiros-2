import { inject, Injectable } from '@angular/core';
import { TaskService } from '../task/task.service';
import { map, Observable } from 'rxjs';

export interface TasksCountInfo {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}

export type MembersBusynessInfo = Map<string | 'unassigned', number>;

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private tasks = inject(TaskService);

  getTasksCountInfo$(): Observable<TasksCountInfo> {
    return this.tasks.tasks$.pipe(
      map((tasks) => {
        return {
          total: tasks.length,
          todo: tasks.filter((t) => t.status === 'todo').length,
          inProgress: tasks.filter((t) => t.status === 'in_progress').length,
          done: tasks.filter((t) => t.status === 'done').length,
        };
      })
    );
  }

  getMembersBusynessInfo$(): Observable<MembersBusynessInfo> {
    return this.tasks.tasks$.pipe(
      map((tasks) => {
        const res: MembersBusynessInfo = new Map<string, number>();
        for (const task of tasks) {
          const assigneeId = task.assigneeId ?? 'unassigned';
          res.set(
            assigneeId,
            res.has(assigneeId) ? res.get(assigneeId) + 1 : 1
          );
        }

        return res;
      })
    );
  }
}

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { TaskService } from '../../../services/task/task.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, take } from 'rxjs';
import { TuiDataListWrapper, TuiSelect } from '@taiga-ui/kit';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';
import { TaskPriority, TaskStatus } from '../../../models/task.interface';

@Component({
  selector: 'app-task-dialog',
  imports: [
    CommonModule,
    TuiSelect,
    ReactiveFormsModule,
    TuiDataListWrapper,
    TuiTextfield,
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDialogComponent implements OnInit {
  private taskService = inject(TaskService);
  private readonly destroyRef = inject(DestroyRef);

  readonly statusItems: TaskStatus[] = ['todo', 'in_progress', 'done'];
  readonly priorityItems: TaskPriority[] = [
    'low',
    'medium',
    'high',
    'critical',
  ];

  statusControl = new FormControl<TaskStatus>('todo', [Validators.required]);
  priorityControl = new FormControl<TaskPriority>('medium', [
    Validators.required,
  ]);

  taskId = input.required<string>();

  readonly task$ = toObservable(this.taskId).pipe(
    switchMap((id) => this.taskService.getTask$(id))
  );

  ngOnInit() {
    this.task$
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((task) => {
        this.statusControl.setValue(task.status, { emitEvent: false });
        this.priorityControl.setValue(task.priority, { emitEvent: false });
      });

    this.statusControl.valueChanges.subscribe((s: TaskStatus) =>
      this.taskService.updateTask$(this.taskId(), { status: s }).subscribe()
    );

    this.priorityControl.valueChanges.subscribe((p: TaskPriority) =>
      this.taskService.updateTask$(this.taskId(), { priority: p }).subscribe()
    );
  }

  stringifyStatus(s: TaskStatus): string {
    switch (s) {
      case 'todo':
        return 'Backlog';
      case 'in_progress':
        return 'In progress';
      case 'done':
        return 'Done';
    }
  }

  stringifyPriority(p: TaskPriority): string {
    switch (p) {
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      case 'critical':
        return 'Critical';
    }
  }
}

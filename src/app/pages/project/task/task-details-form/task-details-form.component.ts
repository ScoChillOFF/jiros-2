import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { TuiTextfield } from '@taiga-ui/core';
import {
  TuiDataListWrapper,
  TuiInputDate,
  TuiSelect,
} from '@taiga-ui/kit';
import { MemberService } from '../../../../services/members/members.service';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../../../../components/user-card/user-card.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../../models/user.interface';
import { of, take, switchMap, filter } from 'rxjs';
import { TaskService } from '../../../../services/task/task.service';
import {
  Task,
  TaskPriority,
  TaskStatus,
} from '../../../../models/task.interface';
import { UserService } from '../../../../services/users/users.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { TuiDay } from '@taiga-ui/cdk/date-time';

@Component({
  selector: 'app-task-details-form',
  imports: [
    TuiTextfield,
    TuiDataListWrapper,
    CommonModule,
    UserCardComponent,
    TuiSelect,
    ReactiveFormsModule,
    TuiInputDate,
  ],
  templateUrl: './task-details-form.component.html',
  styleUrl: './task-details-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailsFormComponent implements OnInit {
  private memberService = inject(MemberService);
  private userService = inject(UserService);
  private taskService = inject(TaskService);

  private destroyRef = inject(DestroyRef);

  task = input.required<Task | null>();

  taskId$ = toObservable(computed(() => this.task()?.id)).pipe(
    filter((id): id is string => !!id)
  );

  readonly members$ = this.memberService.members$;

  readonly statusItems: TaskStatus[] = ['todo', 'in_progress', 'done'];
  readonly priorityItems: TaskPriority[] = [
    'low',
    'medium',
    'high',
    'critical',
  ];

  form = new FormGroup({
    status: new FormControl<TaskStatus>('todo', [Validators.required]),
    priority: new FormControl<TaskPriority>('medium', [Validators.required]),
    assignee: new FormControl<User | null>(null),
    dueDate: new FormControl<TuiDay | null>(null),
  });

  constructor() {
    effect(() => {
      const t = this.task();
      if (!t) {
        this.form.reset({}, { emitEvent: false });
        return;
      }

      this.fillFormFromTask(t);
    });

    this.registerControlUpdate(this.form.controls.priority, (tp) => {
      return { priority: tp };
    });

    this.registerControlUpdate(this.form.controls.status, (ts) => {
      return { status: ts };
    });

    this.registerControlUpdate(this.form.controls.assignee, (u) => {
      return { assigneeId: u?.id ?? null };
    });

    this.registerControlUpdate(this.form.controls.dueDate, (dd) => {
      return { dueDate: dd?.toLocalNativeDate().getTime() ?? null };
    });
  }

  ngOnInit() {
    const t = this.task();
    if (t) {
      this.fillFormFromTask(t);
    }
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

  private fillFormFromTask(t: Task) {
    this.form.patchValue(
      {
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate
          ? TuiDay.fromLocalNativeDate(new Date(Math.max(t.dueDate, 0)))
          : null,
      },
      { emitEvent: false }
    );
    this.userService
      .getUser$(t.assigneeId)
      .pipe(take(1))
      .subscribe((u) => {
        this.form.controls.assignee.setValue(u, { emitEvent: false });
      });
  }

  private registerControlUpdate<T>(
    control: FormControl<T>,
    toPatch: (v: T) => Partial<Task> | null
  ): void {
    control.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(() => control.dirty),
        switchMap((v) =>
          this.taskId$.pipe(
            take(1),
            switchMap((id) => {
              const patch = toPatch(v);
              return patch ? this.taskService.updateTask$(id, patch) : of(null);
            })
          )
        )
      )
      .subscribe();
  }
}

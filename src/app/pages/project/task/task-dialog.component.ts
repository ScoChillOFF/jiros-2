import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { TaskService } from '../../../services/task/task.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { shareReplay, switchMap } from 'rxjs';

@Component({
  selector: 'app-task-dialog',
  imports: [CommonModule],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDialogComponent {
  private taskService = inject(TaskService);

  taskId = input.required<string>();
  readonly task$ = toObservable(this.taskId).pipe(
    switchMap(id => this.taskService.getTask$(id)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}

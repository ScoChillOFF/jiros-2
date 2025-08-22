import { TuiTable, TuiTableCell } from '@taiga-ui/addon-table';
import { Component, inject, signal, OnInit, model } from '@angular/core';
import { TaskService } from '../../../services/task/task.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, finalize, map, of } from 'rxjs';
import { TuiChip } from '@taiga-ui/kit';
import { TaskPriority, TaskStatus } from '../../../models/task.interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDialog, TuiTextfield } from '@taiga-ui/core';
import { TaskDialogComponent } from '../task/task-dialog.component';

@Component({
  selector: 'app-tasks-page.component',
  imports: [
    CommonModule,
    RouterModule,
    TuiChip,
    TuiTable,
    TuiTableCell,
    ReactiveFormsModule,
    TuiButton,
    TuiTextfield,
    TuiDialog,
    TaskDialogComponent,
  ],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.less',
})
export class TasksPageComponent implements OnInit {
  private taskService = inject(TaskService);

  readonly tasks$ = this.taskService.tasks$;

  isAddOpen = signal(false);
  isPending = signal(false);

  readonly titleCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  openAdd() {
    this.isAddOpen.set(true);
  }

  cancelAdd() {
    this.isAddOpen.set(false);
    this.titleCtrl.reset('');
  }

  submitAdd() {
    if (this.isPending() || this.titleCtrl.invalid) {
      return;
    }

    const raw = this.titleCtrl.value.trim();
    if (!raw) {
      return;
    }

    this.isPending.set(true);

    this.taskService
      .createTask$({ title: raw })
      .pipe(
        finalize(() => this.isPending.set(false)),
        catchError(() => of(null))
      )
      .subscribe((task) => {
        if (!task) {
          return;
        }
        this.titleCtrl.reset('');
        this.isAddOpen.set(false);
      });
  }

  isDialogOpen = model(false);
  taskId = signal<string | null>(null);

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    this.route.queryParamMap
      .pipe(map((pm) => pm.get('task')))
      .subscribe((id) => {
        this.taskId.set(id);
        this.isDialogOpen.set(!!id);
      });
  }

  onDialogChange(next: boolean) {
    if (!next) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { task: null },
        queryParamsHandling: 'merge',
      });
    }
  }

  statusLabel(s: TaskStatus): string {
    switch (s) {
      case 'in_progress':
        return 'In progress';
      case 'done':
        return 'Done';
      default:
        return 'Backlog';
    }
  }

  statusTag(
    s: TaskStatus
  ):
    | 'default'
    | 'success'
    | 'warning'
    | 'error'
    | 'neutral'
    | 'info'
    | 'accent' {
    switch (s) {
      case 'done':
        return 'success';
      case 'in_progress':
        return 'warning';
      default:
        return 'info';
    }
  }

  priorityLabel(p: TaskPriority): string {
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

  priorityTag(
    p: TaskPriority
  ):
    | 'default'
    | 'success'
    | 'warning'
    | 'error'
    | 'neutral'
    | 'info'
    | 'accent' {
    switch (p) {
      case 'low':
        return 'info';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      case 'critical':
        return 'accent';
    }
  }

  isExpired(t: number): boolean {
    return t < Date.now();
  }
}

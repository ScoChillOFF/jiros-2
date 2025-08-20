import { TuiTable, TuiTableCell } from '@taiga-ui/addon-table';
import { Component, inject, signal } from '@angular/core';
import { TaskService } from '../../../services/task/task.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { TuiChip, TuiElasticContainer } from '@taiga-ui/kit';
import { TaskPriority, TaskStatus } from '../../../models/task.interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';

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
],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.less',
})
export class TasksPageComponent {
  private taskService = inject(TaskService);
  columns = {
    name: { width: '20rem' },
    priority: { width: '8rem' },
    status: { width: '10rem' },
  };

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

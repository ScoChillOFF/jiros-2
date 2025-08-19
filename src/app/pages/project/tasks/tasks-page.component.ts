import { TuiTable, TuiTableCell } from '@taiga-ui/addon-table';
import { Component, inject } from '@angular/core';
import { TaskService } from '../../../services/task/task.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { TuiChip } from '@taiga-ui/kit';
import { TaskPriority, TaskStatus } from '../../../models/task.interface';

@Component({
  selector: 'app-tasks-page.component',
  imports: [
    CommonModule,
    RouterModule,
    TuiChip,
    TuiTable,
    TuiTableCell,
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

  // readonly tasks$ = this.taskService.tasks$;
  tasks$ = of([
    {
      id: '1',
      title: 'Task 1',
      status: 'in_progress' as TaskStatus,
      priority: 'low' as TaskPriority,
      dueDate: Date.now() - 200000000
    },
    {
      id: '2',
      title: 'Task 2',
      status: 'done' as TaskStatus,
      priority: 'medium' as TaskPriority,
      dueDate: Date.now()
    },
    {
      id: '3',
      title: 'Task 3',
      status: 'todo' as TaskStatus,
      priority: 'high' as TaskPriority,
    },
  ]);

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

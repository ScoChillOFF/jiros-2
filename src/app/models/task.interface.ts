export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  creatorId: string;
  assigneeId?: string | null;
  dueDate?: number | null;
  createdAt: number;
  updatedAt: number;
}

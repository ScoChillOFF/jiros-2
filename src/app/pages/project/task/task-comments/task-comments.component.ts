import { Component, computed, inject, input } from '@angular/core';
import { TaskService } from '../../../../services/task/task.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Task } from '../../../../models/task.interface';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, filter, map, of, startWith, switchMap } from 'rxjs';
import { TuiButton, TuiLabel, TuiTextfield } from '@taiga-ui/core';
import { TuiTextarea } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/users/users.service';
import { UserCardComponent } from '../../../../components/user-card/user-card.component';

@Component({
  selector: 'app-task-comments',
  imports: [
    ReactiveFormsModule,
    TuiTextfield,
    TuiTextarea,
    TuiLabel,
    TuiButton,
    CommonModule,
    UserCardComponent,
  ],
  templateUrl: './task-comments.component.html',
  styleUrl: './task-comments.component.less',
})
export class TaskCommentsComponent {
  private taskService = inject(TaskService);
  private userService = inject(UserService);

  task = input.required<Task | null>();

  readonly taskId$ = toObservable(computed(() => this.task()?.id)).pipe(
    filter((id): id is string => !!id)
  );

  readonly comments$ = this.taskId$.pipe(
    switchMap((id) => {
      return this.taskService.listComments$(id);
    })
  );

  readonly commentsWithUser$ = this.comments$.pipe(
    switchMap((comments) => {
      if (!comments?.length) return of([]);
      const user$List = comments.map((c) =>
        this.userService.getUser$(c.authorId).pipe(startWith(null))
      );
      return combineLatest(user$List).pipe(
        map((users) => comments.map((c, i) => ({ comment: c, user: users[i] })))
      );
    })
  );

  commentForm = new FormGroup({
    text: new FormControl('', [Validators.required]),
  });

  onCommentCreate() {
    const text = this.commentForm.controls.text.value;

    this.taskId$
      .pipe(switchMap((id) => this.taskService.addComment$(id, text)))
      .subscribe();

    this.commentForm.reset({ text: '' });
  }

  getUserById$(id: string) {
    return this.userService.getUser$(id);
  }
}

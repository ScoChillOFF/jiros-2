import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { ProjectService } from '../../services/project/project.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TuiButton, TuiDialogService, TuiTextfield } from '@taiga-ui/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-projects-page.component',
  imports: [
    CommonModule,
    RouterModule,
    TuiButton,
    ReactiveFormsModule,
    TuiTextfield,
  ],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.less',
})
export class ProjectsPageComponent {
  private projectService = inject(ProjectService);
  private readonly dialogs = inject(TuiDialogService);

  @ViewChild('createDialog', { static: true })
  private createDialogTpl!: TemplateRef<unknown>;

  form = new FormGroup({
    projectName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly projects$ = this.projectService.myProjects$;

  openCreate(): void {
    this.dialogs
      .open<string>(this.createDialogTpl, {
        label: 'Create project',
        size: 'm',
        dismissible: true,
      })
      .subscribe((name) => {
        if (name) {
          this.projectService.createProject$(name).subscribe();
          console.log('Create project:', name);
        }
      });
  }

  submit(observer: { next: (v: string) => void; complete: () => void }): void {
    if (this.form.valid) {
      observer.next(this.form.value.projectName);
      observer.complete();
      this.form.reset();
    }
  }
}

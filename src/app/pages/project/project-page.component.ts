import { Component, inject } from '@angular/core';
import { ProjectService } from '../../services/project/project.service';
import { CommonModule } from '@angular/common';
import { TuiTabsHorizontal, TuiTab } from '@taiga-ui/kit';
import { RouterModule } from '@angular/router';
import { TuiScrollbar } from '@taiga-ui/core';

@Component({
  selector: 'app-project-page.component',
  imports: [
    CommonModule,
    TuiTabsHorizontal,
    TuiTab,
    RouterModule,
    TuiScrollbar,
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.less',
})
export class ProjectPageComponent {
  private projectService = inject(ProjectService);

  readonly currentProject$ = this.projectService.currentProject$;
}
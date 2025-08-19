import { Component, inject } from '@angular/core';
import { ProjectService } from '../../services/project/project.service';
import { CommonModule } from '@angular/common';
import { TuiTabsHorizontal, TuiTab } from "@taiga-ui/kit";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-page.component',
  imports: [CommonModule, TuiTabsHorizontal, TuiTab, RouterModule],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.less',
})
export class ProjectPageComponent {
  private projectService = inject(ProjectService);

  readonly currentProject$ = this.projectService.currentProject$;
}

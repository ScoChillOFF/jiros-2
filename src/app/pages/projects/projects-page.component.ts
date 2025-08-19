import { Component, inject } from '@angular/core';
import { ProjectService } from '../../services/project/project.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-projects-page.component',
  imports: [CommonModule, RouterModule],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.less',
})
export class ProjectsPageComponent {
  private projectService = inject(ProjectService);

  // readonly projects$ = this.projectService.myProjects$;
  projects$ = of([
    {
      id: '1',
      name: 'Project 1',
    },
    {
      id: '2',
      name: 'Project 2',
    },
    {
      id: '3',
      name: 'Project 3',
    },
    {
      id: '4',
      name: 'Project 4',
    },
  ]);
}

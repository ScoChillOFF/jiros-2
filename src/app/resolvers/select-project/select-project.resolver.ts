import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ProjectService } from '../../services/project/project.service';
import { inject } from '@angular/core';

export const selectProjectResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const projectService = inject(ProjectService);

  const projectId = route.paramMap.get('projectId');
  if (projectId) {
    projectService.setCurrentProject(projectId);
  } else {
    projectService.setCurrentProject(null);
  }

  return true;
};

import { Route } from '@angular/router';
import { LoginPageComponent } from './pages/login/login-page.component';
import { MainPageComponent } from './pages/main/main-page.component';
import { ProfilePageComponent } from './pages/profile/profile-page.component';
import { ProjectsPageComponent } from './pages/projects/projects-page.component';
import { ProjectPageComponent } from './pages/project/project-page.component';
import { StatsPageComponent } from './pages/project/stats/stats-page.component';
import { MembersPageComponent } from './pages/project/members/members-page.component';
import { TasksPageComponent } from './pages/project/tasks/tasks-page.component';
import { authGuard } from './guards/auth/auth.guard';
import { noAuthGuard } from './guards/no-auth/no-auth.guard';
import { selectProjectResolver } from './resolvers/select-project/select-project.resolver';

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [noAuthGuard],
    title: 'Login',
  },
  {
    path: '',
    component: MainPageComponent,      
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'projects' },

      { path: 'profile', component: ProfilePageComponent, title: 'Profile' },

      {
        path: 'projects',
        children: [
          { path: '', component: ProjectsPageComponent, title: 'Projects' },

          {
            path: ':projectId',
            component: ProjectPageComponent,
            resolve: { ok: selectProjectResolver },
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'tasks' },

              { path: 'stats', component: StatsPageComponent, title: 'Stats' },

              {
                path: 'members',
                component: MembersPageComponent,
                title: 'Members',
              },

              {
                path: 'tasks',
                children: [
                  { path: '', component: TasksPageComponent, title: 'Tasks' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  { path: '**', redirectTo: '' },
];

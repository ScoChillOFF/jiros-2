import { MemberService } from './../../../services/members/members.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TaskService } from '../../../services/task/task.service';

@Component({
  selector: 'app-stats-page',
  imports: [],
  templateUrl: './stats-page.component.html',
  styleUrl: './stats-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsPageComponent {
  private taskService = inject(TaskService);
  private MemberService = inject(MemberService);

  
}

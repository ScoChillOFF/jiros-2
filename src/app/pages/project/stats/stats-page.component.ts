import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/users/users.service';
import {
  StatsService,
  MembersBusynessInfo,
} from './../../../services/stats/stats.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { User } from '../../../models/user.interface';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { UserCardComponent } from "../../../components/user-card/user-card.component";

interface UserBusynessInfo {
  key: string | 'unassigned';
  count: number;
  user: User | null;
}

@Component({
  selector: 'app-stats-page',
  imports: [CommonModule, UserCardComponent],
  templateUrl: './stats-page.component.html',
  styleUrl: './stats-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsPageComponent {
  private statsService = inject(StatsService);
  private userService = inject(UserService);

  readonly tasksCountInfo$ = this.statsService.getTasksCountInfo$();
  readonly busynessInfo$ = this.statsService.getMembersBusynessInfo$();

  readonly membersBusynessWithUsers$: Observable<UserBusynessInfo[]> =
    this.busynessInfo$.pipe(
      switchMap((busynessMap: MembersBusynessInfo | null) => {
        if (!busynessMap || busynessMap.size === 0) {
          return of([]);
        }

        const userRequests$: Observable<UserBusynessInfo>[] = [];

        busynessMap.forEach((count: number, userId: string | 'unassigned') => {
          if (userId === 'unassigned') {
            userRequests$.push(
              of({
                key: 'unassigned',
                count,
                user: null,
              })
            );
          } else {
            userRequests$.push(
              this.userService.getUser$(userId).pipe(
                map((user: User | null) => ({
                  key: userId,
                  count,
                  user,
                })),
              )
            );
          }
        });

        return combineLatest(userRequests$);
      })
    );
}

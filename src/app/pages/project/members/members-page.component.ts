import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserService } from '../../../services/users/users.service';
import { MemberService } from '../../../services/members/members.service';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';
import { UserCardComponent } from '../../../components/user-card/user-card.component';
import { SearchBoxComponent } from '../../../components/search-box/search-box.component';
import { User } from '../../../models/user.interface';
import { TuiButtonClose } from '@taiga-ui/kit';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-members-page.component',
  imports: [
    CommonModule,
    UserCardComponent,
    SearchBoxComponent,
    TuiButtonClose,
    TuiButton,
  ],
  templateUrl: './members-page.component.html',
  styleUrl: './members-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersPageComponent {
  private userService = inject(UserService);
  private memberService = inject(MemberService);

  searchFn$ = this.userService.searchUsersByEmailPrefix$.bind(this.userService);

  readonly isOwner$ = this.userService.currentUser$.pipe(
    switchMap((u) => this.memberService.isOwner$(u?.id ?? null))
  );

  readonly members$ = this.memberService.members$;

  onRemoveMember(memberId: string) {
    this.memberService.removeMember$(memberId).subscribe();
  }

  onPick(user: User) {
    this.memberService.addMember$(user.id).subscribe();
  }
}

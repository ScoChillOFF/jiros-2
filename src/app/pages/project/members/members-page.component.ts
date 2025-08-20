import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/users/users.service';
import { MemberService } from '../../../services/members/members.service';
import { CommonModule } from '@angular/common';
import { of, switchMap } from 'rxjs';
import { UserCardComponent } from '../../../components/user-card/user-card.component';
import { SearchBoxComponent } from '../../../components/search-box/search-box.component';
import { User } from '../../../models/user.interface';

@Component({
  selector: 'app-members-page.component',
  imports: [CommonModule, UserCardComponent, SearchBoxComponent],
  templateUrl: './members-page.component.html',
  styleUrl: './members-page.component.less',
})
export class MembersPageComponent {
  private userService = inject(UserService);
  private memberService = inject(MemberService);

  searchFn$ = this.userService.searchUsersByEmailPrefix$.bind(this.userService);
  readonly isOwner$ = this.userService.currentUser$.pipe(
    switchMap((u) => this.memberService.isOwner$(u?.id ?? null))
  );

  // readonly members$ = this.memberService.members$;
  members$ = of([
    {
      id: '1',
      email: 'example@mail.com',
      displayName: null,
      photoURL: '',
      projects: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: '2',
      email: 'anotherexample@mail.com',
      displayName: 'John Doe',
      photoURL: '',
      projects: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ]);

  onPick(user: User) {
    console.log('User selected from search:', user);
  }
}

import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TuiTitle } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-user-card',
  imports: [TuiAvatar, TuiTitle],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  readonly user = input.required<User>();
  titleSize = input<number>(18);
  subtitleSize = input<number>(14);
  avatarSize = input<'xs' | 's' | 'm' | 'l'>('xs');
}

import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TuiTextfield, TuiDropdown } from '@taiga-ui/core';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  of,
  startWith,
  Observable,
} from 'rxjs';

@Component({
  selector: 'app-search-box',
  imports: [CommonModule, ReactiveFormsModule, TuiTextfield, TuiDropdown],
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent<T extends { id: string }> {
  placeholder = input('Search…');
  minLength = input(1);
  searchFn = input.required<(q: string) => Observable<T[]>>();
  itemTpl = input<TemplateRef<{ $implicit: T }> | null>(null);

  itemSelected = output<T>();
  querySubmitted = output<string>();

  readonly ctrl = new FormControl('', { nonNullable: true });

  readonly results$: Observable<T[]> = this.ctrl.valueChanges.pipe(
    startWith(this.ctrl.value),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap((q) => {
      const query = (q ?? '').trim();
      if (query.length < this.minLength()) {
        return of<T[]>([]);
      }
      return this.searchFn()(query).pipe(catchError(() => of<T[]>([])));
    })
  );

  pick(item: T) {
    this.ctrl.reset();
    this.itemSelected.emit(item);
  }

  onEnter() {
    const q = this.ctrl.value.trim();
    if (q.length >= this.minLength()) {
      this.querySubmitted.emit(q);
    }
  }
}

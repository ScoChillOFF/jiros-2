import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailsFormComponent } from './task-details-form.component';

describe('TaskDetailsFormComponent', () => {
  let component: TaskDetailsFormComponent;
  let fixture: ComponentFixture<TaskDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

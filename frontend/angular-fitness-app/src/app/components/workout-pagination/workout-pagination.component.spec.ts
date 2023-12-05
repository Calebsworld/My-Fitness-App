import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutPaginationComponent } from './workout-pagination.component';

describe('WorkoutPaginationComponent', () => {
  let component: WorkoutPaginationComponent;
  let fixture: ComponentFixture<WorkoutPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkoutPaginationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

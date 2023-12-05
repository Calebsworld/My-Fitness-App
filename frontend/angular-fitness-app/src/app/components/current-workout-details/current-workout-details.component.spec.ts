import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentWorkoutDetailsComponent } from './current-workout-details.component';

describe('CurrentWorkoutDetailsComponent', () => {
  let component: CurrentWorkoutDetailsComponent;
  let fixture: ComponentFixture<CurrentWorkoutDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentWorkoutDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentWorkoutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkoutButtonComponent } from './create-workout-button.component';

describe('CreateWorkoutButtonComponent', () => {
  let component: CreateWorkoutButtonComponent;
  let fixture: ComponentFixture<CreateWorkoutButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWorkoutButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateWorkoutButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

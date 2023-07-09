import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisePaginationComponent } from './exercise-pagination.component';

describe('ExercisePaginationComponent', () => {
  let component: ExercisePaginationComponent;
  let fixture: ComponentFixture<ExercisePaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExercisePaginationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExercisePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

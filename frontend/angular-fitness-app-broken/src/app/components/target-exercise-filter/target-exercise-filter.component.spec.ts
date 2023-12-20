import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetExerciseFilterComponent } from './target-exercise-filter.component';

describe('TargetExerciseFilterComponent', () => {
  let component: TargetExerciseFilterComponent;
  let fixture: ComponentFixture<TargetExerciseFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetExerciseFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetExerciseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

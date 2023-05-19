import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyPartExerciseFilterComponent } from './body-part-exercise-filter.component';

describe('BodyPartExerciseFilterComponent', () => {
  let component: BodyPartExerciseFilterComponent;
  let fixture: ComponentFixture<BodyPartExerciseFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BodyPartExerciseFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyPartExerciseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentExerciseFilterComponent } from './equipment-exercise-filter.component';

describe('EquipmentExerciseFilterComponent', () => {
  let component: EquipmentExerciseFilterComponent;
  let fixture: ComponentFixture<EquipmentExerciseFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipmentExerciseFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentExerciseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

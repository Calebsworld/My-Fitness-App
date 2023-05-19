import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Filter } from 'src/app/common/Filter';
import { ExerciseService } from 'src/app/services/exercise.service';


@Component({
  selector: 'app-equipment-exercise-filter',
  templateUrl: './equipment-exercise-filter.component.html',
  styleUrls: ['./equipment-exercise-filter.component.css']
})
export class EquipmentExerciseFilterComponent implements OnInit {

   
  public selectedValue:string = '';
  public equipment:string[] = [];
  @Output() filterEvent = new EventEmitter<Filter>();


  constructor(private exerciseService:ExerciseService) { };

  ngOnInit(): void {
    this.getEquipmentList()
  }

  getEquipmentList() {
    this.exerciseService.getEquipment().subscribe(data => {
      this.equipment = data;
    })
  }

  onChange() {
    this.filterEvent.emit({key:'equipment', value: this.selectedValue})
  }

  reset(): void {
    this.selectedValue = '';
    this.onChange();
  }



}

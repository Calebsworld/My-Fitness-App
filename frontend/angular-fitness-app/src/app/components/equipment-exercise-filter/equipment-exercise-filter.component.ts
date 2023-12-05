import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter } from 'src/app/common/Filter';
import { ExerciseService } from 'src/app/services/exercise.service';


@Component({
  selector: 'app-equipment-exercise-filter',
  templateUrl: './equipment-exercise-filter.component.html',
  styleUrls: ['./equipment-exercise-filter.component.css']
})
export class EquipmentExerciseFilterComponent implements OnInit {

  public selectedValue:string = '';
  public equipment$?:Observable<string[]>
  @Input() filterValue?:string 
  @Output() filterEvent = new EventEmitter<Filter>();

  constructor(private exerciseService:ExerciseService) { };

  ngOnInit(): void {
    this.getEquipmentList()
  }

  getEquipmentList() {
    this.equipment$ = this.exerciseService.getEquipment()
  }

  onChange() {
    this.filterEvent.emit({key:'equipment', value: this.selectedValue!})
  }

  reset(): void {
    this.selectedValue = '';
    this.onChange();
  }

}
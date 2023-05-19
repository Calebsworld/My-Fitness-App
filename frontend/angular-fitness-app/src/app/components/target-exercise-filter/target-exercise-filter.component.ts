import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Filter } from 'src/app/common/Filter';
import { ExerciseService } from 'src/app/services/exercise.service';

@Component({
  selector: 'app-target-exercise-filter',
  templateUrl: './target-exercise-filter.component.html',
  styleUrls: ['./target-exercise-filter.component.css']
})
export class TargetExerciseFilterComponent implements OnInit {

  public selectedValue:string = ''
  public targets:string[] = [];
  @Output() filterEvent = new EventEmitter<Filter>()

  constructor(private excerciseService:ExerciseService) { }

  ngOnInit(): void {
    this.getTargets()
    }

  getTargets() {
    this.excerciseService.getTargets().subscribe(data => {
      this.targets = data;
    })
  }

  onChange() {
    this.filterEvent.emit({key: 'target', value: this.selectedValue})
  }

  reset(): void {
    this.selectedValue = '';
    this.onChange();
  }

}

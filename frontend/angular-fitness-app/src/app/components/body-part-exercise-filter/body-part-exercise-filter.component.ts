import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Filter } from 'src/app/common/Filter';
import { ExerciseService } from 'src/app/services/exercise.service';

@Component({
  selector: 'app-body-part-exercise-filter',
  templateUrl: './body-part-exercise-filter.component.html',
  styleUrls: ['./body-part-exercise-filter.component.css']
})

export class BodyPartExerciseFilterComponent implements OnInit {
 
  public selectedValue: string = '';
  public bodyParts:string[] = [];
  @Output() filterEvent = new EventEmitter<Filter>();
 
  constructor(private exerciseService: ExerciseService) { };
  
  ngOnInit(): void {
    this.getBodyParts()
  }

  getBodyParts() {
    this.exerciseService.getBodyParts()
    .subscribe(data => {
      this.bodyParts = data;
    })
  }

  onChange(): void {
    this.filterEvent.emit({key: 'bodypart', value: this.selectedValue})
  }

  reset(): void {
    this.selectedValue = '';
    this.onChange();
  }


}


import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { Filter } from 'src/app/common/Filter';
import { ExerciseService } from 'src/app/services/exercise.service';

@Component({
  selector: 'app-body-part-exercise-filter',
  templateUrl: './body-part-exercise-filter.component.html',
  styleUrls: ['./body-part-exercise-filter.component.css'],
  standalone: true,
  imports: [NgIf, AsyncPipe, FormsModule]
})

export class BodyPartExerciseFilterComponent implements OnInit{
 
  public selectedValue: string = '';
  public bodyParts$?:Observable<string[]>
  @Output() filterEvent = new EventEmitter<Filter>();
 
  constructor(private exerciseService: ExerciseService) { };
  
  ngOnInit(): void {
    this.getBodyParts()
  }

  getBodyParts() {
    this.bodyParts$ = this.exerciseService.getBodyParts()
  }

  onChange(): void {
    this.filterEvent.emit({key: 'bodypart', value: this.selectedValue!})
  }

  reset(): void {
    this.selectedValue = '';
    this.onChange();
  }


}


import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Filter } from 'src/app/common/Filter';
import { ExerciseService } from 'src/app/services/exercise.service';

@Component({
  selector: 'app-target-exercise-filter',
  templateUrl: './target-exercise-filter.component.html',
  styleUrls: ['./target-exercise-filter.component.css'],
  standalone: true,
  imports: [NgIf, AsyncPipe, FormsModule]
})
export class TargetExerciseFilterComponent implements OnInit {

  public selectedValue:string = ''
  public targets$?:Observable<string[]>
  @Output() filterEvent = new EventEmitter<Filter>()

  constructor(private excerciseService:ExerciseService) { }

  ngOnInit(): void {
    this.getTargets()
  }

  getTargets() {
    this.targets$ = this.excerciseService.getTargets()
  }

  onChange() {
    this.filterEvent.emit({key: 'target', value: this.selectedValue!})
  }

  reset(): void {
    this.selectedValue = '';
    this.onChange();
  }

}

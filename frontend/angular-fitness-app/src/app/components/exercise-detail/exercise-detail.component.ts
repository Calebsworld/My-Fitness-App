import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Exercise } from 'src/app/common/Exercise';
import { ExerciseService } from 'src/app/services/exercise.service';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.css']
})
export class ExerciseDetailComponent implements OnInit, OnDestroy {

exercise?:Exercise;
#unsubscribe = new Subject<void>()

constructor(public route:ActivatedRoute, 
            public exerciseService:ExerciseService) { }


  ngOnInit(): void {
    this.getExerciseDetails()
  }

  ngOnDestroy(): void {
    this.#unsubscribe.next()
    this.#unsubscribe.complete
  }


  getExerciseDetails() {
    const id:string = this.route.snapshot.paramMap.get("id")!
    this.exerciseService.getExerciseById(id).pipe(
      takeUntil(this.#unsubscribe)
    ).subscribe(data => {
      this.exercise = data
    })
  }

}

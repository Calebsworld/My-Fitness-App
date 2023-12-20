import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Exercise } from 'src/app/common/Exercise';
import { ExerciseService } from 'src/app/services/exercise.service';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.css'],
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterModule]
})
export class ExerciseDetailComponent implements OnInit {

workoutId?: number 
exercise$?:Observable<Exercise>;

constructor(public route:ActivatedRoute, 
            private exerciseService:ExerciseService) { }


  ngOnInit(): void {
    this.workoutId = +this.route.snapshot.paramMap.get("workoutId")!
    this.getExerciseDetails()
  }

  getExerciseDetails() {
    const id:string = this.route.snapshot.paramMap.get("exerciseId")!
    this.exercise$ = this.exerciseService.getExerciseById(id)
  }
}

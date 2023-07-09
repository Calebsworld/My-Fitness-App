import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Exercise } from 'src/app/common/Exercise';
import { Router } from '@angular/router';
import { WorkoutService } from 'src/app/services/workout.service';

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.css']
})
export class ExerciseListComponent implements OnInit {
 
  @Input() exercises!: Exercise[];
  @Input() workoutId?: string;
  
  public exerciseSuccessMessage?: string

  constructor(private workoutService:WorkoutService,
              private router:Router) { }

  
  ngOnInit(): void {
    
  }

  addToWorkout(exercise: Exercise) {
    if (!!this.workoutId) {
      // Add the exercise to the workout with the corresponding ID
      this.workoutService.addExerciseToWorkout(this.workoutId, exercise);
      this.showExerciseMessage()
      // Optionally, you can display a success message or perform any other necessary actions.
    } else {
      // Handle the case where there is no valid workout ID.
      // You can display an error message or prevent the user from adding the exercise.
      console.log("Error adding exercise to workout.")
    }
  }

  showExerciseMessage() {
    this.exerciseSuccessMessage = 'Exercise successfully added to workout'
    window.scrollTo(0, 0);
    setTimeout(() => {
      this.exerciseSuccessMessage = undefined
    }, 3000)
  }
 

}
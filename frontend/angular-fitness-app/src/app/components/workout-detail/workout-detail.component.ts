import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Workout } from 'src/app/common/Workout';
import { WorkoutService } from 'src/app/services/workout.service';

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.component.html',
  styleUrls: ['./workout-detail.component.css']
})
export class WorkoutDetailComponent implements OnInit {

  workoutId!:string
  workout!: Workout 
  exerciseDeleteMessage?: string = undefined

  constructor(private workoutService:WorkoutService,
              private route:ActivatedRoute, 
              private router:Router) {}

  ngOnInit(): void {
    this.workoutId = this.route.snapshot.paramMap.get('id')! 
    this.showWorkoutDetails()
  }

  showWorkoutDetails() {
    this.workout = this.workoutService.getWorkoutById(this.workoutId)!
  }

  removeExercise(exerciseId:number) {
    this.workoutService.removeExerciseFromWorkout(this.workoutId, exerciseId)
    // if cant find the exercise with the given id after removal then run code below else, delete was unsuccessful.  
    this.exerciseDeleteMessage = 'Exercise succesfully removed from the workout'
    this.showDeleteMessage(this.exerciseDeleteMessage)
    
  }

  showDeleteMessage(message?:string) {
    if (message) {
      setTimeout(() => {
        this.exerciseDeleteMessage = undefined
      }, 2000)
    }
  }

  addExercise() {
    const data = { workoutId: this.workout.id }
    this.router.navigate(['/exercise'],  { state: data })
  }
  



}

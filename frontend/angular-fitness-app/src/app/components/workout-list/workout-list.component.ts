import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workout } from 'src/app/common/Workout';
import { WorkoutService } from 'src/app/services/workout.service';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css']
})
export class WorkoutListComponent implements OnInit {
  
  workouts:Workout[] = []

  workoutDeleteMessage?:string

  constructor(private workoutService:WorkoutService, 
             private router:Router) {}
  
  ngOnInit(): void {
    this.listWorkouts()
    // get workouts from my db and render to the user
  }

  listWorkouts() {
    this.workouts = this.workoutService.workouts
  }

  editWorkout(id:string) {
    this.router.navigate(['/workout-details', id]);
  }

  private showDeleteMessage(message?:string) {
    if (message) {
      setTimeout(() => {
        this.workoutDeleteMessage = undefined
      }, 2000)
    }
  }

  removeWorkout(id:string) {
    this.workoutService.removeWorkout(id)
    this.workoutDeleteMessage = 'Workout successfully deleted'
    this.showDeleteMessage(this.workoutDeleteMessage)
    this.listWorkouts()
  }




}

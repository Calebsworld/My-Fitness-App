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

  constructor(private workoutService:WorkoutService, 
             private router:Router) {}
  
  ngOnInit(): void {
    this.updateWorkouts()
  }

  updateWorkouts() {
    this.workouts = this.workoutService.workouts
  }

  editWorkout(id:string) {
    this.router.navigate(['/workout-details', id]);
  }

  removeWorkout(id:string) {
    this.workoutService.removeWorkout(id)
    this.updateWorkouts()
  }




}

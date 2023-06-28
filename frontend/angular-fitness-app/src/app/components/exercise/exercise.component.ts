import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from 'src/app/services/workout.service';
import { Workout } from 'src/app/common/Workout';
import * as uuid from "uuid"

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent implements OnInit {

  public workoutId?:string

  constructor(private router: Router, 
              private workoutService: WorkoutService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
  }

  onWorkoutIdChanged(workoutId: string) {
    this.workoutId = workoutId
  }

  createWorkout() {

    // Initialize an empty workout object
    let newWorkout: Workout = {
      id: uuid.v4(),
      name: '', 
      description: '',
      exercises: []
    };

    this.workoutService.saveWorkout(newWorkout)
    
    // Route to the workout form and pass the ID of the new workout as a parameter
    this.router.navigate(['/workout-form'], { queryParams: { workoutId: newWorkout.id } });

  }







}

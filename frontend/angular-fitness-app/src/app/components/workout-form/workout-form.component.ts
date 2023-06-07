import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from 'src/app/services/workout.service';
import { Workout } from 'src/app/common/Workout';

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css']
})

export class WorkoutFormComponent {
  workoutId!: string;
  workout: Workout = { 
    name: '', 
    description: '', 
    exercises: [] 
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workoutService: WorkoutService
  ) {}

  ngOnInit() {
    // Retrieve the workout ID from the query parameters
    this.route.queryParams.subscribe((params) => {
      this.workoutId = params['workoutId'];
    });
  }

  submitForm() {
    this.workout.id = this.workoutId
    this.workoutService.updateWorkout(this.workoutId, this.workout);
    this.router.navigate(['/exercise'], { queryParams: { workoutId: this.workout.id }});
  }
}

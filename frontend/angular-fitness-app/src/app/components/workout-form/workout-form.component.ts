import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from 'src/app/services/workout.service';
import { Workout } from 'src/app/common/Workout';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css']
})

export class WorkoutFormComponent implements OnInit {
  workoutId?: string;
  workout: Workout = { 
    name: '', 
    description: '', 
    exercises: [] 
  }

  workoutFormGroup!:FormGroup 

  #unsubscribe$: Subject<void> = new Subject<void>();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workoutService: WorkoutService,
    private formBuilder:FormBuilder
  ) {}

  ngOnInit() {
    // Retrieve the workout ID from the router state
    this.workoutId = history.state.workoutId

    this.workoutFormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      description: new FormControl('', [Validators.required, Validators.minLength(5)])
    })

  }

  submitForm() {
    console.log(this.workoutFormGroup.value)
    const {name, description} = this.workoutFormGroup.value
    this.workout.id = this.workoutId
    this.workout.name = name
    this.workout.description = description
    this.workoutService.updateWorkout(this.workoutId!, this.workout);
    const data = {workoutId: this.workoutId, successMessage: 'Workout successfully created.' }
    this.router.navigate(['/exercise'], { state: data });
  }

  handleCancel() {
    this.router.navigate(['/exercise'])
  }

  isWorkoutNameInvalid() {
    const workoutNameControl = this.workoutFormGroup.get('name')
    return workoutNameControl?.invalid && (workoutNameControl.dirty || workoutNameControl.touched)
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.workoutFormGroup.get(controlName);
    return !!control?.hasError(errorType);
  }


}

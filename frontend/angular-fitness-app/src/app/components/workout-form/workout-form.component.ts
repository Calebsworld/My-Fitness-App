import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from 'src/app/services/workout.service';
import { Workout } from 'src/app/common/Workout';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css']
})

export class WorkoutFormComponent implements OnDestroy {
  workoutId!: string;
  workout: Workout = { 
    name: '', 
    description: '', 
    exercises: [] 
  }

  workoutFormGroup!:FormGroup 

  private unsubscribe$: Subject<void> = new Subject<void>();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workoutService: WorkoutService,
    private formBuilder:FormBuilder
  ) {}

  ngOnInit() {
    // Retrieve the workout ID from the query parameters
    //TODO unsubscribe onDestroy
    const subs = this.route.queryParams.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((params) => {
      this.workoutId = params['workoutId'];
    });

    this.workoutFormGroup = this.formBuilder.group({
      name: [''],
      description: ['']
    })

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  submitForm() {
    const {name, description} = this.workoutFormGroup.value
    this.workout.id = this.workoutId
    this.workout.name = name
    this.workout.description = description
    this.workoutService.updateWorkout(this.workoutId, this.workout);
    this.router.navigate(['/exercise'], { queryParams: { workoutId: this.workout.id, 
                                                        successMessage: 'Workout successfully created.' }});
  }

  handleCancel() {
    this.router.navigate(['/exercise'])
  }



}

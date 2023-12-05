import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from 'src/app/services/workout.service';
import { Workout } from 'src/app/common/Workout';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidation } from 'src/app/common/FormValidation';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css']
})

export class WorkoutFormComponent implements OnInit {

  workoutFormGroup!:FormGroup 
  workoutResponse$?: Observable<any>
  workoutExistMessage?: String

  workoutId?:number 
  workout$?: Observable<Workout>
  routeUrl?:string

  constructor(
    private router: Router,
    private workoutService: WorkoutService,
    private formBuilder:FormBuilder,
    private route:ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.workoutId = +params.get('id')!;
      if (!this.workoutId) {
        this.initializeNewWorkoutForm();
        this.routeUrl = '/exercise'
      } else {
        this.loadExistingWorkoutForm(this.workoutId);
        this.routeUrl = '/workout'
      }
    });
}

initializeNewWorkoutForm() {
    this.workoutFormGroup = this.formBuilder.group({
        name: new FormControl('', [Validators.required, Validators.minLength(2), FormValidation.notOnlyWhitespace]),
        description: new FormControl('', [Validators.required, Validators.minLength(5), FormValidation.notOnlyWhitespace])
    });
}

loadExistingWorkoutForm(workoutId: number) {
    this.workoutService.getWorkoutById(workoutId).subscribe(workout => {
      console.log('Received workout:', workout);
        this.workoutFormGroup = this.formBuilder.group({
            name: new FormControl(workout.name, [Validators.required, Validators.minLength(2), FormValidation.notOnlyWhitespace]),
            description: new FormControl(workout.description, [Validators.required, Validators.minLength(5), FormValidation.notOnlyWhitespace])
        });
    });
}


  submitForm() {
    if (this.workoutFormGroup.invalid) {
      this.workoutFormGroup.markAllAsTouched()
      return
    }
    if (!!this.workoutId) {
      this.updateWorkout()
    } else {
      this.createWorkout()
    }

  }

  createWorkout() {
    const {name, description} = this.workoutFormGroup.value
    const workoutToSave:Workout = { name, description}
    this.workoutService.addOrUpdateWorkout(workoutToSave).subscribe(
      (res:WorkoutDto) => {
        if (res.status === 201) {
          this.router.navigate([`/exercise/workout/${res.id}`], { queryParams: { workoutSuccessMessage: res.message }});
        }
      })
  }

  updateWorkout() {
    const {name, description} = this.workoutFormGroup.value
    const workoutToSave:Workout = { id: this.workoutId, name, description}   
    this.workoutService.addOrUpdateWorkout(workoutToSave).subscribe(
      (res:WorkoutDto) => {
        console.log(res.status)
        if (res.status === 200) {
          this.router.navigate(['/exercise'], { queryParams: {workoutId: res.id, workoutSuccessMessage: res.message } });
        }
      })  
  }

  handleCancel() {
    this.router.navigate([this.routeUrl])
  }

  isWorkoutNameInvalid() {
    const workoutNameControl = this.workoutFormGroup.get('name')
    return workoutNameControl?.invalid && (workoutNameControl.dirty || workoutNameControl.touched)
  }

  isWorkoutDescriptionInvalid(): any {
    const workoutDescriptionControl = this.workoutFormGroup.get('description')
    return workoutDescriptionControl?.invalid && (workoutDescriptionControl.dirty || workoutDescriptionControl.touched)
    }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.workoutFormGroup?.get(controlName);
    return !!control?.hasError(errorType);
  }


}

export interface WorkoutDto {
  id: number;
  name: string;
  description: string;
  message: string;
  status: number;
}


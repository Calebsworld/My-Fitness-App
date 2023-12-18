import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Exercise } from 'src/app/common/Exercise';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseModalComponent } from '../exercise-modal/exercise-modal.component';
import { WorkoutService } from 'src/app/services/workout.service';

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.css']
})
export class ExerciseListComponent implements OnInit {
 
  @Input() exercises!: Exercise[]
  @Input() workoutId?: number
  @Input() exerciseId?:number

  @Output() exerciseSuccessEvent = new EventEmitter<string>()

  public exerciseSuccessMessage?: string
  public exerciseErrorMessage?:string

  constructor(private workoutService:WorkoutService,
              private router:Router,
              private modalService: NgbModal) { }

  
  ngOnInit(): void {
     // When the component loads then open the modal and pass exercise modal component. add the exercise id. and in modal recieve as input. 
    if (!!this.workoutId && !!this.exerciseId) {
      const modalRef = this.modalService.open(ExerciseModalComponent)
      modalRef.componentInstance.workoutId = this.workoutId
      modalRef.componentInstance.exerciseId = this.exerciseId
      modalRef.result.then((result) => {
        console.log(result)
        if (result.status === 200) {
          const message = result.message
          this.router.navigate(['/workout-details', this.workoutId], { queryParams: { exerciseUpdateMessage: message }})     
        } 
    }).catch((error) => {
        console.log(error);
    });
    }
  }

  addToWorkout(exercise: Exercise) {
    if (!!this.workoutId) {
      const modalRef = this.modalService.open(ExerciseModalComponent)
      modalRef.componentInstance.exercise = exercise
      modalRef.componentInstance.workoutId = this.workoutId
      modalRef.result.then((result) => {
        console.log(result)
        if (result.status === 201) {
            this.exerciseSuccessMessage = result.message;
            this.exerciseSuccessEvent.emit(this.exerciseSuccessMessage)
            this.workoutService._workoutChangedSubject.next(this.workoutId!)
        } 
    }).catch((error) => {
        console.log(error);
    });
    }
  }




}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, map, takeUntil, tap } from 'rxjs';
import { Workout } from 'src/app/common/Workout';
import { WorkoutService } from 'src/app/services/workout.service';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.css']
})
export class WorkoutComponent implements OnInit {
  workoutResponse$!:Observable<WorkoutWrapperDto>
  workouts$!:Observable <Workout[]>  
  page$!:Observable <Page>

  currentPage:number = 1
  pageSize:number = 10

  workoutDeleteMessage?:string
  
  #unsubscribe$ = new Subject<void>()

  constructor(private workoutService:WorkoutService, 
             private router:Router) {}
  
  ngOnInit(): void {
    this.listWorkouts()
  }

  ngOnDestroy(): void {
    this.#unsubscribe$.next()
    this.#unsubscribe$.complete
  }

  listWorkouts() {
    this.workoutResponse$ = this.workoutService.getWorkouts(this.currentPage-1, this.pageSize)
    
    this.workouts$ = this.workoutResponse$.pipe(
    map(response => response.workouts))

    this.page$ = this.workoutResponse$.pipe(
      map(response => response.page)
    )
  }

  viewWorkoutDetails(id:number) {
    this.router.navigate(['/workout-details', id]);
  }

  editWorkout(id:number) {
    this.router.navigate(['workout-form', id])
  }

  removeWorkout(id:number) {
    this.workoutDeleteMessage = undefined
    this.workoutService.removeWorkout(id).pipe(
      takeUntil(this.#unsubscribe$)
    ).subscribe(
      res => {
        console.log(res)
        if (res.status === 200) {
          this.workoutDeleteMessage = res.message
            this.showDeleteMessage()
            this.listWorkouts()     
        } 
      }
    )
  }

  onPageChange(page:number) {
    this.currentPage = page
  }

  onPageSizeChange(pageSize:number) {
    this.pageSize = pageSize 
    this.currentPage = 1
  }

  private showDeleteMessage() {
    if (this.workoutDeleteMessage) {
      setTimeout(() => {
        this.workoutDeleteMessage = undefined
      }, 1000)
    }
  }
}

interface Page {
  currentPage: number,
  pageSize: number,
  totalPages: number,
  totalElements: number,
}

interface WorkoutWrapperDto {
  workouts: Workout[],
  page: Page
}
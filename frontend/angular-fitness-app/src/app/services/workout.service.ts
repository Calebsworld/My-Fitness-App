import { Injectable } from '@angular/core';
import { Workout } from '../common/Workout';
import { Exercise } from '../common/Exercise';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';
import { WorkingSet } from '../common/WorkingSet';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

_workoutChangedSubject = new BehaviorSubject<number|null>(null);
workoutChanged$ = this._workoutChangedSubject.asObservable();


  constructor(private httpClient:HttpClient,
              private router:Router) {}

  // This service will be used to create, edit, and delete workout objects. 
  // This service will also be used to add/remove exercises and update an exercise for a given workout.

  getWorkouts(page:number, size:number): Observable<WorkoutWrapperDto> {
    return this.httpClient.get<WorkoutWrapperDto>(`${environment.baseUrl}?page=${page}&size=${size}`)
  }

  getWorkoutById(workoutId:number) {
    return this.httpClient.get<Workout>(`${environment.baseUrl}/${workoutId}`)
  }

  getExercises(workoutId:number) { 
    return this.httpClient.get<Exercise[]>(`${environment.baseUrl}/${workoutId}/exercises`) 
  }

  getExercise(workoutId:number, exerciseId:number) {
    return this.httpClient.get<Exercise>(`${environment.baseUrl}/${workoutId}/exercises/${exerciseId}`)
  }

  getWorkingSets(workoutId:number, exerciseId:number) {
    return this.httpClient.get<WorkingSet[]>(`${environment.baseUrl}/${workoutId}/exercises/${exerciseId}/workingSets`)
  }

  addOrUpdateWorkout(workout:Workout): Observable<WorkoutResponse> {
    return this.httpClient.post<WorkoutResponse>(environment.baseUrl, workout)
  }

  removeWorkout(workoutId:number) {
    return this.httpClient.delete<WorkoutResponse>(`${environment.baseUrl}/${workoutId}`)
  }

  addOrUpdateExercise(workoutId:number, exerciseWrapperDto:ExerciseWrapperDto): Observable<ExerciseResponse> {
    const url = `${environment.baseUrl}/${workoutId}/exercises`
    return this.httpClient.post<ExerciseResponse>(url, exerciseWrapperDto)
  }

  removeExerciseFromWorkout(workoutId:number, exerciseId:number) {
    const url = `${environment.baseUrl}/${workoutId}/exercises/${exerciseId}`
    return this.httpClient.delete<ExerciseResponse>(url)
  }

}

interface WorkoutWrapperDto {
  workouts: Workout[],
  page: Page
}

interface Page {
  currentPage: number,
  pageSize: number,
  totalPages: number,
  totalElements: number,
}

export interface WorkoutResponse {
  id: number;
  name: string;
  description: string;
  message: string;
  status: number;
}

export interface ExerciseResponse {
  message: string,
  exercise:Exercise,
  status: number
}

export interface ExerciseDto {
    id?: number, 
    name?: string,
    target?: string,
    bodypart?: string,
    equipment?: string,
    gifUrl?: string
}

export interface ExerciseWrapperDto {
  exerciseDto: ExerciseDto,
  workingSetDtos: WorkingSet[],
  workingSetIds: number[]
}






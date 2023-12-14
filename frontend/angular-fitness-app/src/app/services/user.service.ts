import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, of, retry, throwError } from 'rxjs';
import { Exercise } from '../common/Exercise';
import { WorkingSet } from '../common/WorkingSet';
import { Workout } from '../common/Workout';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { User } from '../common/User';
import { UserDto } from '../common/UserDto';


@Injectable({
  providedIn: 'root'
})
export class UserService  {

  private user?: User
  private userObj!: UserObj
  private userEmail?: string
  private userAvatar?: string
  private userWorkoutUrl?: string 

  constructor(private httpClient:HttpClient,
              private router:Router) { }

  getUser(): User | undefined {
    const userJson = localStorage.getItem('user')
    if (userJson) {
      return JSON.parse(userJson)
    }
    return undefined
  }

  setUser(user: User): void {
    this.user = user
    this.constructUserWorkoutUrl()
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('isUserSet', JSON.stringify(true))
  }

  clearUser() {
    localStorage.removeItem('user')
    localStorage.removeItem('isUserSet')
  }

  setUserObj(email:string, avatar:string): void {
      this.userObj.avatar = avatar
      this.userObj.email = email
  }

  getUserObj(): UserObj {
    return this.userObj
  }
  
  getEmail() {
    return this.userEmail
  }

  setEmail(email:string) {
    this.userEmail = email
  }

  getAvatar() {
    return this.userAvatar
  }

  setAvatar(avatar:string) {
    this.userAvatar = avatar
  }

  // Retrieve the user by email address from auth0 service, use Hibernate built in method, if not exists then route to user-form component.
  GetUserByEmail(email:string): Observable<UserResponse> {
    return this.httpClient.get<UserResponse>(`${environment.newBaseUrl}/${email}`)
  } 

  GetUserById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${environment.newBaseUrl}/user/${id}`)
  }

  addUser(userDto: UserDto): Observable<UserResponse>  {
    return this.httpClient.post<UserResponse>(`${environment.newBaseUrl}`, userDto)
  }

  updateUser(user: User): Observable<UserResponse>  {
    return this.httpClient.put<UserResponse>(`${environment.newBaseUrl}`, user)
  }

  deleteUser(id: number): Observable<UserResponse> {
    return this.httpClient.delete<UserResponse>(`${environment.newBaseUrl}/${id}`)
  }

  getWorkouts(page: number, size: number): Observable<WorkoutWrapperDto> {
    const url = this.getUserWorkoutUrl();
    
    if (url) {
      return this.httpClient.get<WorkoutWrapperDto>(`${url}?page=${page}&size=${size}`).pipe(
        retry(3),
        catchError((error) => {
          // Handle the error here
          console.error(`Error fetching workouts from ${url}:`, error);
          // You can choose to rethrow the error or return a default value
          return throwError(`Unable to fetch workouts from ${url}`);
        })
      );
    } else {
      // If the URL is not available, return an Observable that represents an error
      return throwError('UserWorkoutUrl is not available.');
    }
  }
  
  getWorkoutById(workoutId:number) {
    const url = this.getUserWorkoutUrl();
  
    if (url) {
      return this.httpClient.get<Workout>(`${url}/${workoutId}`).pipe(
        retry(3),
        catchError((error) => {
          // Handle the error here
          console.error(`Error fetching workout from ${url} with this workoutId: ${workoutId}:`, error);
          // You can choose to rethrow the error or return a default value
          return throwError(`Unable to fetch workout from ${url}`);
        })
      );

    } else {
      // If the URL is not available, return an Observable that represents an error
      return throwError('UserWorkoutUrl is not available.');
    }
  
  }

  getExercises(workoutId:number) { 
    const url = this.getUserWorkoutUrl()
    if (url) {
      return this.httpClient.get<Exercise[]>(`${url}/${workoutId}/exercises`).pipe(
        retry(3),
        catchError((error) => {
          // Handle the error here
          console.error(`Error fetching exercises from ${url} with this workoutId: ${workoutId}:`, error);
          // You can choose to rethrow the error or return a default value
          return throwError(`Unable to fetch exercises from ${url}`);
        })
      );
    } else {
       return throwError('UserWorkoutUrl is not available.');
    }
   
  }

  getExercise(workoutId:number, exerciseId:number) {
    const url = this.getUserWorkoutUrl()
    if (url) {
      return this.httpClient.get<Exercise>(`${url}/${workoutId}/exercises/${exerciseId}`).pipe(
        retry(3),
        catchError((error) => {
          console.error(`Error fetching exercise from ${url} with this workoutId: ${workoutId} and this exerciseId: ${exerciseId} :`, error);
          // You can choose to rethrow the error or return a default value
          return throwError(`Unable to fetch exercise from ${url}`);
        })
      )
    } else {
      return throwError('UserWorkoutUrl is not available.');
    }
  }

  addOrUpdateWorkout(workout:Workout): Observable<WorkoutResponse> {
    const url = this.getUserWorkoutUrl()
    console.log("user url: " + url)
    console.log(this.user)
    if (!!url) {
      return this.httpClient.post<WorkoutResponse>(url, workout).pipe(
        catchError((error) => {
          console.error(`Error adding/updating workout: ${workout} :`, error);
          // You can choose to rethrow the error or return a default value
          return throwError(`Unable to add/update workout from ${url}`);
        })
      )
    } else {
      return throwError('UserWorkoutUrl is not available.');
    }
  }

  removeWorkout(workoutId:number) {
    const url = this.getUserWorkoutUrl()
    if (url) {
      return this.httpClient.delete<WorkoutResponse>(`${url}/${workoutId}`).pipe(
        catchError((error) => {
          console.error(`Error deleting workout with this workoutId: ${workoutId} :`, error);
          // You can choose to rethrow the error or return a default value
          return throwError(`Unable to delete workout from ${url}`);
        })
      )
    } else {
      return throwError('UserWorkoutUrl is not available.');
    }
  }

  addOrUpdateExercise(workoutId:number, exerciseWrapperDto:ExerciseWrapperDto): Observable<ExerciseResponse> {
    const url = this.getUserWorkoutUrl()
    if (url) {
      return this.httpClient.post<ExerciseResponse>(`${url}/${workoutId}/exercises`, exerciseWrapperDto).pipe(
        catchError((error) => {
          console.error(`Error adding/updating exercise ${exerciseWrapperDto.exerciseDto} from this workoutId: ${workoutId} :`, error);
          return throwError(`Unable to add/update exercise from ${url}`);
        })
      )
    } else {
      return throwError('UserWorkoutUrl is not available.');
    }
  
  }

  removeExerciseFromWorkout(workoutId:number, exerciseId:number) {
    const url = this.getUserWorkoutUrl()
    if (url) {
      return this.httpClient.delete<ExerciseResponse>(`${url}/${workoutId}/exercises/${exerciseId}`).pipe(
        catchError((error) => {
          console.error(`Error deleting exercise with exerciseId: ${exerciseId} from this workoutId: ${workoutId} :`, error);
          return throwError(`Unable to add/update exercise from ${url}`);
        })
      )
    } else {
      return throwError('UserWorkoutUrl is not available.');
    }
  }

  private constructUserWorkoutUrl(): void {
    if (!this.user?.id) {
      this.userWorkoutUrl = undefined
    }
    this.userWorkoutUrl = `${environment.newBaseUrl}/${this.user?.id}/workouts`
  }

  private getUserWorkoutUrl(): string | undefined {
    if (this.user?.id && !this.userWorkoutUrl) {
      this.constructUserWorkoutUrl()
    }
    return this.userWorkoutUrl 
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

export interface UserResponse {
  user: User
  message: string;
  status: number
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

export type UserObj = {
  email: string,
  avatar: string
}
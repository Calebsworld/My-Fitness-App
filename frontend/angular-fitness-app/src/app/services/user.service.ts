import { Injectable} from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject, catchError, of, retry, throwError } from 'rxjs';
import { Exercise } from '../common/Exercise';
import { WorkingSet } from '../common/WorkingSet';
import { Workout } from '../common/Workout';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { User } from '../common/User';
import { UserDto } from '../common/UserDto';


@Injectable({
  providedIn: 'root'
})
export class UserService  {

  private auth0User: Auth0User = {
    id: '',
    email: '',
    avatar: ''
  }
  private userWorkoutUrl?: string 
  private userUrl?: string;

  private userSource = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());
  user$ = this.userSource.asObservable();
  public isUserSet$ = new ReplaySubject<boolean>(1) 


  constructor(private httpClient:HttpClient,
              private router:Router) { }

              
  getUser(): User | null {
    const currentUser = this.userSource.value
    if (!currentUser) {
      const userFromStorage = this.getUserFromLocalStorage()
      if (userFromStorage) {
        this.userSource.next(userFromStorage)
      }
      return userFromStorage
    }
    return currentUser
  }

  setUser(user: User): void {
    this.userSource.next(user);
    localStorage.setItem('user', JSON.stringify(user))
    this.isUserSet$.next(true);
    this.constructUserUrl()
    this.constructUserWorkoutUrl()
  }

  private getUserFromLocalStorage(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  clearUserAndDefaultUser() {
    localStorage.clear()
    this.isUserSet$.next(false)
  }

  getAuth0User(): Auth0User | undefined {
    const defaultUserJson = localStorage.getItem('auth0User')
    if (!defaultUserJson) {
      return undefined      
    }
    return JSON.parse(defaultUserJson)
  } 

  setAuth0User(id:number|string, email:string, avatar:string): void {
      this.auth0User.id = id
      this.auth0User.email = email
      this.auth0User.avatar = avatar
      localStorage.setItem('auth0User', JSON.stringify(this.auth0User))
  }

  // Retrieve the user by email address from auth0 service, use Hibernate built in method, if not exists then route to user-form component.
  GetUserByEmail(email:string): Observable<UserResponse> {
    return this.httpClient.get<UserResponse>(`${environment.newBaseUrl}/public/${email}`)
  } 

  GetUserById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${environment.newBaseUrl}/public/user/${id}`)
  }

  addUser(userDto: UserDto): Observable<UserResponse>  {
    return this.httpClient.post<UserResponse>(`${environment.newBaseUrl}/public/users`, userDto)
  }

  updateUserAvatar(file: FormData): Observable<UserResponse>  {
    const url = this.getUserUrl()
    if (!url) {
      return throwError('UserWorkoutUrl is not available.');
    }
    return this.httpClient.put<UserResponse>(`${url}/avatar`, file)
  }

  deleteUser(id: number, idToken: any): Observable<UserResponse> {
    const url = this.getUserUrl()
    console.log(url)
    const headers = new HttpHeaders({
      'X-ID-Token': idToken
    });
    return this.httpClient.delete<UserResponse>(`${url}`, { headers: headers })
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
    
    if (url) {
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
   const storedUser = this.getUser()
    if (!storedUser) {
      this.userWorkoutUrl = undefined
    }
    this.userWorkoutUrl = `${environment.newBaseUrl}/private/users/${storedUser?.id}/workouts`
  }

  private getUserWorkoutUrl(): string | undefined {
    const storedUser = this.getUser()

    if (storedUser?.id && !this.userWorkoutUrl) {
      this.constructUserWorkoutUrl()
    }
    return this.userWorkoutUrl 
  }

private constructUserUrl(): void {
  const storedUser = this.getUser()
   if (storedUser === null) {
     this.userUrl = undefined
   }
   this.userUrl = `${environment.newBaseUrl}/private/users/${storedUser?.id}`
 }

 private getUserUrl(): string | undefined {
   const storedUser = this.getUser()

   if (storedUser?.id && !this.userUrl) {
     this.constructUserUrl()
   }
   return this.userUrl 
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
  imgData: string
  message: string
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

export type Auth0User = {
  id: string | number
  email: string,
  avatar: string
}

export interface FileUploadResponse {
  fileName: string,
  fileDownLoadUri: string,
  fileType: string,
  size: number
}
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";
import { Exercise } from "../common/Exercise";
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  // These will store the data and will be used for caching
  private exercises: Exercise[] = [];  
  private exercise!: Exercise | undefined;
  private bodyParts: string[] = [];
  private equipment: string[] = [];
  private targets: string[] = [];

  private baseUrl = environment.exerciseDbBaseUrl;
  private targetUrl = environment.exerciseDbTargetUrl;
  private bodyPartUrl = environment.exerciseDbBodyPartUrl;
  private equipmentUrl = environment.exerciseDbEquipmentUrl;
  private targetListUrl = environment.exerciseDbTargetListUrl;
  private bodyPartListUrl = environment.exerciseDbBodyPartListUrl;
  private equipmentListUrl = environment.exerciseDbEquipmentListUrl;

  private headers = new HttpHeaders()
    .set('X-RapidAPI-Key', environment.X_RapidAPI_Key)
    .set('X-RapidAPI-Host', environment.X_RapidAPI_Host);

  private options = {
    headers: this.headers,
  };

  constructor(private httpClient: HttpClient) {}
  
  getExercises(): Observable<Exercise[]> {
    if (this.exercises.length > 0) {
      // If the data is already cached, return it as an observable
      console.log('data cached')
      return of(this.transformExercises(this.exercises));
    } else {
      // If the data is not cached, make an HTTP request and cache the response
      return this.httpClient
        .get<Exercise[]>(this.baseUrl, this.options)
        .pipe(
          tap((data) => { 
            this.exercises = data;
            this.transformExercises(this.exercises);
            console.log('data not cached')
          }),
          catchError(error => {
            console.error('Error fetching exercises:', error);
            return throwError(error);
          })
        );
    }
  }
  
  transformExercises(exercises: Exercise[]): Exercise[] {
    return exercises.map(exercise => {
      return {
        ...exercise,
        name: this.uppercaseFirstLetter(exercise.name),
        target: this.uppercaseFirstLetter(exercise.target),
        bodyPart: this.uppercaseFirstLetter(exercise.bodyPart),
        equipment: this.uppercaseFirstLetter(exercise.equipment)
      };
    });
  }
  
  uppercaseFirstLetter(str: string): string {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  getExerciseById(id: string): Observable<Exercise> {
    if (this.exercise) {
      // If the data is already cached, return it as an observable
      console.log('data cached')
      return of(this.transformExercise(this.exercise));
    } else {
      const url = `${environment.exerciseDBExerciseByIdUrl}/${id}`;
      return this.httpClient.get<Exercise>(url, this.options).pipe(
        tap((data) => {
          this.exercise = data;
          this.transformExercise(this.exercise);
        })
      );
    }
  }
  
  transformExercise(exercise: Exercise): Exercise {
    return {
      ...exercise,
      name: this.uppercaseFirstLetter(exercise.name),
      target: this.uppercaseFirstLetter(exercise.target),
      bodyPart: this.uppercaseFirstLetter(exercise.bodyPart),
      equipment: this.uppercaseFirstLetter(exercise.equipment)
    };
  }
  
  getExercisesByTarget(target: string): Observable<Exercise[]> {
    const url: string = `${this.targetUrl + target}`;
    return this.httpClient.get<Exercise[]>(url, this.options);
  }

  getExercisesByBodyPart(bodyPart: string): Observable<Exercise[]> {
    const url: string = `${this.bodyPartUrl + bodyPart}`;
    return this.httpClient.get<Exercise[]>(url, this.options);
  }

  getExercisesByEquipment(equipment: string): Observable<Exercise[]> {
    const url: string = `${this.equipmentUrl + equipment}`;
    return this.httpClient.get<Exercise[]>(url, this.options);
  }

  getTargets(): Observable<string[]> {
    if (this.targets.length > 0) {
      console.log('data cached')
      return of(this.targets);
    } else {
      return this.httpClient.get<string[]>(this.targetListUrl, this.options).pipe(
        map((data) => data.map(target => this.uppercaseFirstLetter(target))),
        tap((data) => (this.targets = data))
      );
    }
  }

  getBodyParts(): Observable<string[]> {
    if (this.bodyParts.length > 0) {
      console.log('data cached')
      return of(this.bodyParts);
    } else {
    return this.httpClient.get<string[]>(this.bodyPartListUrl, this.options).pipe(
      map((data) => data.map(bodyPart => this.uppercaseFirstLetter(bodyPart))),
      tap((data) => (this.bodyParts = data)));
    }
  }

  getEquipment(): Observable<string[]> {
    if (this.equipment.length > 0) {
      console.log('data cached')
      return of(this.equipment);
    } else {
    return this.httpClient.get<string[]>(this.equipmentListUrl, this.options).pipe(
      map((data) => data.map(equipment => this.uppercaseFirstLetter(equipment))),
      tap((data) => (this.equipment = data)));
    }
  }

  clearExerciseCache() {
    this.exercise = undefined;
  }

  clearExercisesCache() {
    this.exercises = [];
  }

  clearBodyPartsCache() {
    this.bodyParts = [];
  }

  clearEquipmentCache() {
    this.equipment = [];
  }

  clearTargetsCache() {
    this.targets = [];
  }
  
  
}
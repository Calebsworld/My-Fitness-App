import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

_workoutChangedSubject = new BehaviorSubject<number|null>(null);
workoutChanged$ = this._workoutChangedSubject.asObservable();


  constructor() { }




  
}

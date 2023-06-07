import { Injectable } from '@angular/core';
import { Workout } from '../common/Workout';
import { Exercise } from '../common/Exercise';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  workouts:Workout[] = []

  // This service will be used to create, edit, and delete workout objects. 
  // This service will also be used to add/remove exercises to a given workout.

  getWorkoutById(workoutId:string) {
    return this.workouts.find(workout => workout.id === workoutId)
  }

  saveWorkout(workout:Workout) {
    this.workouts.push(workout) 
  }

  updateWorkout(workoutId: string, updatedWorkout: Workout) {
    // Find the workout with the matching ID
    const workoutIndex = this.workouts.findIndex(workout => workout.id === workoutId);
    if (workoutIndex !== -1) {
      // Update the workout
      this.workouts[workoutIndex] = updatedWorkout;
    }
  }

  removeWorkout(id:string) {
    if (this.workouts.length > 0)
    this.workouts = this.workouts.filter(workout => workout.id !== id) 
  }

  addExerciseToWorkout(id: string, exercise: Exercise) {
    const exerciseToAdd: Exercise = {
      id: exercise.id,
      name: exercise.name,
      gifUrl: exercise.gifUrl,
      target: exercise.target,
      bodyPart: exercise.bodyPart,
      equipment: exercise.equipment
    };
    const workout = this.getWorkoutById(id);
    
    if (workout) {
      workout.exercises.push(exerciseToAdd);
    } else {
      console.log('Workout not found.');
    }
  }

  removeExerciseFromWorkout(id:string, exerciseId:number) {
   
    let workout:Workout|undefined = undefined 
    
    if (this.workouts.length > 0) {
      // find the workout by the id passed in.
      workout = this.getWorkoutById(id)
      if (workout) {
        workout.exercises = workout.exercises?.filter(exercise => exercise.id !== exerciseId) 
      } else {
        console.log("Can't remove exercise from workout that does not exist")
      }
    }
  }


  constructor() { }

}

interface FormData {
  name:string,
  description?:string 

}

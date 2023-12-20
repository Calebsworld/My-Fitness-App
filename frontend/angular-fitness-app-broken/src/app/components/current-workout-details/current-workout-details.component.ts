import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Exercise } from 'src/app/common/Exercise';
import { WorkingSet } from 'src/app/common/WorkingSet';
import { Workout } from 'src/app/common/Workout';
import { UserService } from 'src/app/services/user.service';
import { WorkoutService } from 'src/app/services/workout.service';

@Component({
  selector: 'app-current-workout-details',
  templateUrl: './current-workout-details.component.html',
  styleUrls: ['./current-workout-details.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe]
})
export class CurrentWorkoutDetailsComponent {
  @Input() workoutId?: number;
  workout$!: Observable<Workout>;
  exercises$!: Observable<Exercise[]>;

  private destroy$ = new Subject<void>();

  constructor(private userService:UserService,
              private workoutService:WorkoutService) {}

  ngOnInit() {
    if (!!this.workoutId) {
      this.showWorkoutDetails()
    }
    
    this.refreshCurrentWorkout()
  }

  private showWorkoutDetails(): void {
    this.workout$ = this.userService.getWorkoutById(this.workoutId!)
    this.exercises$ = this.userService.getExercises(this.workoutId!);
  }

   // This will refetch the workout details from the backend every time a workout is modified
  private refreshCurrentWorkout(): void {
    this.workoutService.workoutChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe((changedWorkoutId) => {
        if (this.workoutId === changedWorkoutId) {
          this.showWorkoutDetails();
        }
      });
  }

  groupedSets(exercise: Exercise): { set: WorkingSet; count: number }[] {
    if (exercise.workingSet?.length === 0) return [];

    let output: { set: WorkingSet; count: number }[] = [];
    let currentItem: WorkingSet | null = null;
    let currentCount = 0;

    for (let set of exercise.workingSet!) {
      if (
        currentItem === null ||
        set.reps !== currentItem.reps ||
        set.weight !== currentItem.weight
      ) {
        if (currentItem !== null) {
          output.push({ set: currentItem, count: currentCount });
        }
        currentItem = set;
        currentCount = 1;
      } else {
        currentCount++;
      }
    }
    if (currentItem !== null) {
      output.push({ set: currentItem, count: currentCount });
    }
    return output;
  }
}

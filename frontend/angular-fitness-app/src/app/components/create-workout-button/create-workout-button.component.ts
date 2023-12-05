import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-workout-button',
  templateUrl: './create-workout-button.component.html',
  styleUrls: ['./create-workout-button.component.css']
})
export class CreateWorkoutButtonComponent {

  constructor(private router:Router) {}


  createWorkout() {
    this.router.navigate(['/workout-form']);
  }




}

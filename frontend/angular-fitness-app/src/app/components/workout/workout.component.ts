import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutService } from 'src/app/services/workout.service';
import { Workout } from 'src/app/common/Workout';
import * as uuid from "uuid"

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.css']
})
export class WorkoutComponent implements OnInit {


  
  constructor() {}
  
  ngOnInit(): void {
    
  }






}

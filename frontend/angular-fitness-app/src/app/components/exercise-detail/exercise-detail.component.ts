import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Exercise } from 'src/app/common/Exercise';
import { ExerciseService } from 'src/app/services/exercise.service';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.css']
})
export class ExerciseDetailComponent implements OnInit {

exercise!:Exercise;

constructor(public route:ActivatedRoute, 
            public exerciseService:ExerciseService) { }

ngOnInit(): void {
  this.getExerciseDetails()
}

getExerciseDetails() {
  const id:string = this.route.snapshot.paramMap.get("id")!
  this.exerciseService.getExerciseById(id).subscribe(data => {
    this.exercise = data
  })
}

playAudio(audioUrl:string) {
  let audio = new Audio(audioUrl);
  audio.load();
  audio.play();
}





}

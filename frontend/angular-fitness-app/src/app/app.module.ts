import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExerciseListComponent } from './components/exercise-list/exercise-list.component';
import { ExerciseService } from './services/exercise.service';
import { FormsModule } from '@angular/forms';
import { BodyPartExerciseFilterComponent } from './components/body-part-exercise-filter/body-part-exercise-filter.component';
import { EquipmentExerciseFilterComponent } from './components/equipment-exercise-filter/equipment-exercise-filter.component';
import { TargetExerciseFilterComponent } from './components/target-exercise-filter/target-exercise-filter.component';
import { RouterModule, Routes } from '@angular/router';
import { OpenAiService } from './services/openAi.service';
import { SearchExerciseComponent } from './components/search-exercise/search-exercise.component';
import { ExerciseDetailComponent } from './components/exercise-detail/exercise-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseComponent } from './components/exercise/exercise.component';
import { WorkoutComponent } from './components/workout/workout.component';
import { WorkoutListComponent } from './components/workout-list/workout-list.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';


 const routes:Routes = [
  {path: '', component: HomeComponent},
  {path: 'exercise/:id', component: ExerciseDetailComponent},
  {path: 'exercise', component: ExerciseComponent},
  {path: 'workout', component: WorkoutComponent},
  {path: '**', redirectTo: '/exercise', pathMatch: 'full'}
 ];

@NgModule({
  declarations: [
    AppComponent,
    ExerciseListComponent,
    BodyPartExerciseFilterComponent,
    EquipmentExerciseFilterComponent,
    TargetExerciseFilterComponent,
    SearchExerciseComponent,
    ExerciseDetailComponent,
    ExerciseComponent,
    WorkoutComponent,
    WorkoutListComponent,
    NavbarComponent,
    HomeComponent,
  ],
  imports: [
    NgbModule,
    RouterModule.forRoot(routes),
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    ExerciseService, 
    OpenAiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

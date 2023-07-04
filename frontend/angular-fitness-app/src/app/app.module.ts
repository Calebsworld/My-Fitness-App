import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExerciseListComponent } from './components/exercise-list/exercise-list.component';
import { ExerciseService } from './services/exercise.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { WorkoutDetailComponent } from './components/workout-detail/workout-detail.component';
import { GuideComponent } from './components/guide/guide.component';
import { WorkoutFormComponent } from './components/workout-form/workout-form.component';
import { WorkoutService } from './services/workout.service';


 const routes:Routes = [
  {path: '', component: HomeComponent},
  {path: 'exercise/details/:id', component: ExerciseDetailComponent},
  {path: 'guide', component: GuideComponent},
  {path: 'exercise', component: ExerciseComponent},
  {path: 'workout-details/:id', component: WorkoutDetailComponent},
  {path: 'workout-form', component: WorkoutFormComponent},
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
    WorkoutListComponent,
    WorkoutComponent,
    NavbarComponent,
    HomeComponent,
    WorkoutDetailComponent,
    GuideComponent,
    WorkoutFormComponent
  ],
  imports: [
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forRoot(routes),
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    WorkoutService,
    ExerciseService, 
    OpenAiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

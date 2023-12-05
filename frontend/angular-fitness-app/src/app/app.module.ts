import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { environment } from 'src/environments/environment.development';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExerciseListComponent } from './components/exercise-list/exercise-list.component';
import { ExerciseService } from './services/exercise.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BodyPartExerciseFilterComponent } from './components/body-part-exercise-filter/body-part-exercise-filter.component';
import { EquipmentExerciseFilterComponent } from './components/equipment-exercise-filter/equipment-exercise-filter.component';
import { TargetExerciseFilterComponent } from './components/target-exercise-filter/target-exercise-filter.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchExerciseComponent } from './components/search-exercise/search-exercise.component';
import { ExerciseDetailComponent } from './components/exercise-detail/exercise-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseComponent } from './components/exercise/exercise.component';
import { WorkoutComponent } from './components/workout/workout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { WorkoutDetailComponent } from './components/workout-detail/workout-detail.component';
import { WorkoutFormComponent } from './components/workout-form/workout-form.component';
import { WorkoutService } from './services/workout.service';
import { ExercisePaginationComponent } from './components/exercise-pagination/exercise-pagination.component';
import { ExerciseModalComponent } from './components/exercise-modal/exercise-modal.component';
import { WorkoutPaginationComponent } from './components/workout-pagination/workout-pagination.component';
import { CurrentWorkoutDetailsComponent } from './components/current-workout-details/current-workout-details.component';
import { AuthModule, AuthConfig, AuthGuard } from '@auth0/auth0-angular';
import { LoginButtonComponent } from './components/login-button/login-button.component';
import { SignupButtonComponent } from './components/signup-button/signup-button.component';
import { CallbackComponent } from './components/callback/callback.component';
import { LogoutButtonComponent } from './components/logout-button/logout-button.component';
import { CreateWorkoutButtonComponent } from './components/create-workout-button/create-workout-button.component';
import { LoadingTemplateComponent } from './components/loading-template/loading-template.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoadUserComponent } from './components/load-user/load-user.component';
import { UserFormComponent } from './components/user-form/user-form.component';



const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: "full" },
  { path: 'callback', component: CallbackComponent },
  { path: 'exercise/details/:workoutId/:exerciseId', component: ExerciseDetailComponent },
  { path: 'exercise', component: ExerciseComponent },
  { path: 'exercise/:id', component: ExerciseComponent },
  { path: 'exercise/workout/:workoutId', component: ExerciseComponent },
  { path: 'home', component: HomeComponent },
  { path: 'load-user', component: LoadUserComponent },
  { path: 'user-form', component: UserFormComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'workout/:workoutId/exercises/:exerciseId', component: ExerciseComponent },
  { path: 'workout-details/:id', component: WorkoutDetailComponent },
  { path: 'workout-form', component: WorkoutFormComponent, canActivate: [AuthGuard] },
  { path: 'workout-form/:id', component: WorkoutFormComponent },
  { path: 'workout', component: WorkoutComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
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
    NavbarComponent,
    HomeComponent,
    WorkoutDetailComponent,
    WorkoutFormComponent,
    ExercisePaginationComponent,
    ExerciseModalComponent,
    WorkoutPaginationComponent,
    CurrentWorkoutDetailsComponent,
    LoginButtonComponent,
    SignupButtonComponent,
    CallbackComponent,
    LogoutButtonComponent,
    CreateWorkoutButtonComponent,
    LoadingTemplateComponent,
    ProfileComponent,
    LoadUserComponent,
    UserFormComponent,

  ],
  imports: [
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forRoot(routes),
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot({
      domain: environment.auth0.domain,
      clientId: environment.auth0.client_id,
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    } as AuthConfig),

  ],
  providers: [
    WorkoutService,
    ExerciseService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

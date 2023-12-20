import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { environment } from 'src/environments/environment.development';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExerciseService } from './services/exercise.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthModule, AuthConfig, AuthGuard, AuthHttpInterceptor } from '@auth0/auth0-angular';
import { UserService } from './services/user.service';
import { LoadingTemplateComponent } from './components/loading-template/loading-template.component';
import { NavbarComponent } from "./components/navbar/navbar.component";


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'callback', loadChildren: () => import('./components/callback/callback.component').then(m => m.CallbackComponent) },
  { path: 'exercise/details/:exerciseId', loadChildren: () => import('./components/exercise-detail/exercise-detail.component').then(m => m.ExerciseDetailComponent) },
  { path: 'exercise', loadChildren: () => import('./components/exercise/exercise.component').then(m => m.ExerciseComponent) },
  { path: 'exercise/:id', loadChildren: () => import('./components/exercise/exercise.component').then(m => m.ExerciseComponent) },
  { path: 'exercise/workout/:workoutId', loadChildren: () => import('./components/exercise/exercise.component').then(m => m.ExerciseComponent) },
  { path: 'home', loadChildren: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'load-user', loadChildren: () => import('./components/load-user/load-user.component').then(m => m.LoadUserComponent) },
  { path: 'user-form', loadChildren: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent) },
  { path: 'profile', loadChildren: () => import('./components/profile/profile.component').then(m => m.ProfileComponent), canActivate: [AuthGuard] },
  { path: 'workout/:workoutId/exercises/:exerciseId', loadChildren: () => import('./components/exercise/exercise.component').then(m => m.ExerciseComponent) },
  { path: 'workout-details/:id', loadChildren: () => import('./components/workout-detail/workout-detail.component').then(m => m.WorkoutDetailComponent) },
  { path: 'workout-form', loadChildren: () => import('./components/workout-form/workout-form.component').then(m => m.WorkoutFormComponent), canActivate: [AuthGuard] },
  { path: 'workout-form/:id', loadChildren: () => import('./components/workout-form/workout-form.component').then(m => m.WorkoutFormComponent) },
  { path: 'workout', loadChildren: () => import('./components/workout/workout.component').then(m => m.WorkoutComponent), canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthHttpInterceptor,
            multi: true,
        },
        UserService,
        ExerciseService,
    ],
    bootstrap: [AppComponent],
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
            useRefreshTokens: true,
            tokenRefreshThreshold: 30000,
            // Configure cookies for token storage
            cacheLocation: 'localstorage',
            authorizationParams: {
                audience: environment.auth0.audience,
                redirect_uri: window.location.origin,
            },
            httpInterceptor: {
                allowedList: environment.allowedList
            },
        } as AuthConfig),
        LoadingTemplateComponent,
        NavbarComponent
    ]
})
export class AppModule { }

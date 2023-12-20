import {Component} from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { take } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
   
})

export class AppComponent {
  title = 'angular-fitness-app';

  isAuth0Loading$ = this.authService.isLoading$

  constructor(private authService:AuthService
              ) {}

  ngOnInit() {
    // Subscribe to idToken$ to get the initial token
    this.authService.idTokenClaims$.pipe(
      take(1)).subscribe((token) => {
      // Initial check and renew if needed
      if (token) {
        this.renewToken();
      }
    });
  }

  private renewToken() {
    // Attempt to renew the token silently
    this.authService.getAccessTokenSilently().subscribe(
      (newToken) => {
        console.log('Token renewed successfully:', newToken);
      },
      (error) => {
        console.error('Token renewal failed:', error);
        this.authService.loginWithRedirect({
          appState: {
            target: '/load-user',
          },
        });
        // Handle errors, e.g., redirect to login page
      }
    );
  }
}
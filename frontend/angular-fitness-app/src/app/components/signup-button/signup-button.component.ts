import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-signup-button',
  templateUrl: './signup-button.component.html',
  styleUrls: ['./signup-button.component.css']
})
export class SignupButtonComponent {

  constructor(private auth: AuthService) {}


  handleSignUp(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: '/load-user', // Specify the target route after login
      },
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  }





}

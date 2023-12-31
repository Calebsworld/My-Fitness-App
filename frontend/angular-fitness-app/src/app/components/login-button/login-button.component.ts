import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.css']
})

export class LoginButtonComponent {

  constructor(private auth: AuthService) {}

  initiateAuthProcess() {
    //Make request to an endpoint that generates a random string.
    // Subscribe, call handleLogin, and pass state object 
  }

  handleLogin(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: '/load-user',
      },
    });
  }
}
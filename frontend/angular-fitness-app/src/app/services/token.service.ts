import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private authService:AuthService) { }

  setIdToken() {
    this.authService.idTokenClaims$.subscribe(
      claims => {
        if (claims?.__raw) {
          localStorage.setItem('idToken', JSON.stringify(claims.__raw))
        }
      }
    )
  }

  getIdToken() {
    const idTokenJson = localStorage.getItem('idToken')
    if (!idTokenJson) {
      return undefined
    }
    return JSON.parse(idTokenJson)
  }





}

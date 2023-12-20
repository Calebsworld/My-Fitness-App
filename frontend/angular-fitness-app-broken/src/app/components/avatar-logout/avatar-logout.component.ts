import { AsyncPipe, DOCUMENT, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';
import { Observable, map } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-avatar-logout',
  templateUrl: './avatar-logout.component.html',
  styleUrls: ['./avatar-logout.component.css'],
  standalone: true,
  imports: [NgIf, AsyncPipe]
})
export class AvatarLogoutComponent {
 
  storedUser?: User;
  picture$!: Observable<any>

  constructor(private authService: AuthService, private userService: UserService, private router: Router, @Inject(DOCUMENT) private doc: Document) {}

  ngOnInit(): void {
    this.picture$ = this.authService.user$.pipe(
      map((auth0User) => auth0User?.picture)
    )
  }

  handleLogout(): void {
    this.authService.logout({
      logoutParams: {
        returnTo: this.doc.location.origin,
      },
    });
    this.userService.clearUser()
  }
  
}

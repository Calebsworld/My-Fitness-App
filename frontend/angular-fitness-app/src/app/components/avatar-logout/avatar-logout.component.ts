import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { User } from 'src/app/common/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-avatar-logout',
  templateUrl: './avatar-logout.component.html',
  styleUrls: ['./avatar-logout.component.css']
})
export class AvatarLogoutComponent {
 
  storedUser?: User;
  user$!: Observable<User | null>

  constructor(private authService: AuthService, private userService: UserService, private router: Router, @Inject(DOCUMENT) private doc: Document) {}

  ngOnInit(): void {
    this.showUserAvatar()
  
  }

  showUserAvatar(): void {
    this.user$ = this.userService.user$
  }

  routeToProfile(): void {
    this.router.navigate(['profile'])
  }

  handleLogout(): void {
    this.authService.logout({
      logoutParams: {
        returnTo: this.doc.location.origin,
      },
    });
    this.userService.clearUserAndDefaultUser()
  }
  
}

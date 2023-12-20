import { AsyncPipe, DOCUMENT, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, combineLatest, map } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { AvatarLogoutComponent } from "../avatar-logout/avatar-logout.component";
import { LoginButtonComponent } from "../login-button/login-button.component";
import { SignupButtonComponent } from "../signup-button/signup-button.component";


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: true,
    imports: [AvatarLogoutComponent, LoginButtonComponent, SignupButtonComponent, NgIf, AsyncPipe]
})
export class NavbarComponent implements OnInit {

  isAuthenticated$!: Observable<any>
  isUserSet$!: Observable<boolean>
  combinedObservables$!: Observable<boolean>;

  constructor( private authService: AuthService, @Inject(DOCUMENT) private doc: Document, private userService:UserService) {}
  


  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$
    this.isUserSet$ = this.userService.getIsUserSetStatus()
    this.combinedObservables$ = combineLatest([
      this.isAuthenticated$,
      this.isUserSet$,
    ]).pipe(
      map(([isAuthenticated, isUserSet]) => isAuthenticated && isUserSet)
    );
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

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';
import { Subscription, map, throwError } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-load-user',
  templateUrl: './load-user.component.html',
  styleUrls: ['./load-user.component.css'],
})
export class LoadUserComponent implements OnInit {
  user?: User;
  subscription!: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription = this.authService.user$
      .pipe(
        map((auth0User) => {
          let defaultUser: DefaultUser = { email: auth0User?.email, avatar: auth0User?.picture };
          return defaultUser;
        })
      )
      .subscribe((defaultUser) => {
        if (defaultUser.email && defaultUser.avatar) {
          this.userService.setDefaultUser(defaultUser.email, defaultUser.avatar)
          this.userService.GetUserByEmail(defaultUser?.email).subscribe({
            
            next: (userResponse) => {
              if (userResponse.status === 200) {
                this.userService.setUser(userResponse.user);
                this.router.navigate(['profile']);
              }
            },

            error: (error: any) => {
              console.log(error)
              if (error instanceof HttpErrorResponse) {
                if (error.error.status === 404) {
                  console.log(error.error.message)
                  this.router.navigate(['user-form']);
                }
              } else {
                console.error('Other error occurred:' + error);
              }
            },

          });
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

type DefaultUser = {
  email?: string,
  avatar?: string
}
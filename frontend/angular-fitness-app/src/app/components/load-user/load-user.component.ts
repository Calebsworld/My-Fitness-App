import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';
import { Subscription, catchError, map, tap, throwError } from 'rxjs';
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
          console.log(auth0User);
          let userObj = { email: auth0User?.email, avatar: auth0User?.picture };
          return userObj;
        })
      )
      .subscribe((userObj) => {
        let userEmail = userObj.email;
        let userAvatar = userObj.avatar;

        if (userEmail && userAvatar) {
          this.userService.setEmail(userEmail);
          this.userService.setAvatar(userAvatar);
          this.userService.GetUserByEmail(userEmail).subscribe({
            next: (userResponse) => {
              if (userResponse.status === 200) {
                this.userService.setUser(userResponse.user);
                this.router.navigate(['exercise']);
              }
            },
            error: (error) => {
              if (error.status === 404) {
                // User not found, navigate to the form route
                console.log('Should route to user-form');
                this.router.navigate(['user-form']);
              } else {
                // Handle other errors
                console.error('Other error occurred');
              }
              throwError('Unable to fetch user with that email');
            },
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

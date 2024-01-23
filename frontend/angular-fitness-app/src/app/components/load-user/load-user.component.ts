import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';
import { getValueInRange } from '@ng-bootstrap/ng-bootstrap/util/util';
import { ReplaySubject, Subscription, map, switchMap, tap, throwError } from 'rxjs';
import { convertBase64StringtoUrl } from 'src/app/common/Utils';
import { UserResponse, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-load-user',
  templateUrl: './load-user.component.html',
  styleUrls: ['./load-user.component.css'],
})
export class LoadUserComponent implements OnInit {
  user?: User;
  subscription!: Subscription;
  routeUrl: string | null = '/profile'

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute

  ) {}

  ngOnInit() {
    this.subscription = this.authService.user$
      .pipe(
        tap((auth0User) => console.log(auth0User)),
        map((auth0User) => ({ 
          id: auth0User?.sub,
          email: auth0User?.email, 
          avatar: auth0User?.picture 
        } as Auth0User)),
        switchMap((auth0User) => {
          if (auth0User.id && auth0User.email && auth0User.avatar) {
            this.userService.setAuth0User(auth0User.id, auth0User.email, auth0User.avatar)
            const email = this.userService.getAuth0User()?.email ?? '';
            return this.userService.GetUserByEmail(email);
          } else {
            throw new Error("Invalid user data:" + auth0User);
          }
        }),
          tap({
            next: (userResponse: UserResponse) => {
              if (userResponse.status === 200) {
                let imgUrl: string | undefined;
                if (!userResponse.imgData) {
                  imgUrl = this.userService.getAuth0User()?.avatar || "";
                } else {
                  imgUrl = convertBase64StringtoUrl(userResponse.imgData);
                }
                const user: User = {
                  id: userResponse.user.id,  
                  firstName: userResponse.user.firstName, 
                  lastName: userResponse.user.lastName, 
                  email: userResponse.user.email, 
                  imgUrl: imgUrl, 
                };
                console.log("User:" + user)
                this.userService.setUser(user);
                // read from a route service
                this.router.navigate(['/profile']);
              } else {
                this.userService.isUserSet$.next(false);
              }
            },
            error: (error: any) => {
              if (error instanceof HttpErrorResponse) {
                if (error.error.status === 404) {
                  this.router.navigate(['user-form']);
                }
              } else {
                console.log('Other error occurred:' + error);
              }
            }
          })
      ).subscribe()
    }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  
}

type Auth0User = {
  id: number | string,
  email: string,
  avatar: string
}
import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/common/User';
import { DOCUMENT } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  storedUser?: User;
  user$?: Observable<User>
  isUserSet$!: Observable<boolean>

  constructor(private authService: AuthService, private userService: UserService, private router: Router, @Inject(DOCUMENT) private doc: Document) {}

  ngOnInit(): void {
    this.setUser();
    this.LoadUser();
    this.isUserSet$ = this.userService.isUserSet$
  }

  handleLogout(): void {
    this.authService.logout({
      logoutParams: {
        returnTo: this.doc.location.origin,
      },
    });
    this.userService.clearUser()
  }

  private setUser(): void {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      this.storedUser = JSON.parse(storedUser);
    } else {
      console.error('User not found in local storage');
    }
  }
  
  private LoadUser(): void {
    if (this.storedUser) {
      this.user$ = of(this.storedUser)
      this.user$.forEach((val) => {
        console.log(val)
      })
    }
    
  } 

}
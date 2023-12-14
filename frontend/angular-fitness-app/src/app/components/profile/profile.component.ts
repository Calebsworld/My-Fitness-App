import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/common/User';
import { DOCUMENT } from '@angular/common';
import { Observable, map, of } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  storedUser?: User;
  picture$!: Observable<any>

  constructor(private authService: AuthService, private userService: UserService, private router: Router, @Inject(DOCUMENT) private doc: Document) {}

  ngOnInit(): void {
   
  }


}
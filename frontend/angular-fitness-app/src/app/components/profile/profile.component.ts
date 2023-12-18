import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
  user$!: Observable<User>
  filePath?: string 


  constructor(private userService: UserService, 
              private router: Router) {}


  ngOnInit(): void {
     this.showUser()

  }

  uploadAvatar(): void {
    if (this.filePath) {
      const formData = new FormData();
      formData.append('file', this.filePath);
  
      this.userService.updateUserAvatar(formData).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => {
          console.error(error);
        }
    });
    } else {
      console.warn('No file selected');
    }
  }


  private showUser(): void {
    const storedUser = this.userService.getUser()
    if (storedUser) {
      this.user$ = of(storedUser)
    }
  }



}
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/common/User';

import { Observable, of } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [NgIf, AsyncPipe, FormsModule]
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
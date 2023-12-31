import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FileUploadResponse, UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/common/User';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user$!: Observable<User>
  filePath?: string 
  storedUser?: User 

  @ViewChild('avatarInput') avatarInputRef!: ElementRef;

  constructor(private userService: UserService, 
              private router: Router) {}


  ngOnInit(): void {
    this.showUserProfile()

  }

  showUserProfile() {
    this.storedUser = this.userService.getUser()
    if (this.storedUser) {
      this.user$ = of(this.storedUser)
    }
  }

  uploadFileToServer(file:File): void {
      const formData = new FormData();
      formData.append('file', file);
      this.userService.updateUserAvatar(formData).subscribe({
        next: (userResponse) => {
          if (userResponse.status === 201) {
            console.log(userResponse.user)
            this.userService.setUser(userResponse.user)
            this.storedUser = this.userService.getUser()
            this.user$ = of(this.storedUser!)
          }
          //this.loadUser()
        },
        error: (error) => {
          console.error(error);
        }
    });
    
  }

  uploadAvatar(): void {
    const files = this.avatarInputRef.nativeElement.files
    console.log(files)
    if (files && files[0]) {
      this.uploadFileToServer(files[0])
    }
  }

  private loadUser() {
      this.userService.GetUserByEmail(this.storedUser!.email!).subscribe({
        next: ((userResponse) => {
          if (userResponse.status === 200) {
            console.log(userResponse.user)
            this.userService.setUser(userResponse.user)
            this.storedUser = this.userService.getUser()
            this.user$ = of(this.storedUser!)
          }
        }),
        error: ((error) => {
          console.log(error)
        }),
      })
  }


}

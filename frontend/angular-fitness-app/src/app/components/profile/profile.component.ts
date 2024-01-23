import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FileUploadResponse, UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/common/User';
import { Observable, of } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { TokenService } from 'src/app/services/token.service';
import { DOCUMENT } from '@angular/common';
import { convertBase64StringtoUrl } from 'src/app/common/Utils';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user$!: Observable<User | null>;
  filePath?: string;

  @ViewChild('avatarInput') avatarInputRef!: ElementRef;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit(): void {
    this.showUserProfile();
  }

  showUserProfile() {
    this.user$ = this.userService.user$;
  }

  uploadFileToServer(file: File): void {
    const formData = new FormData();
    formData.append('file', file);
    this.userService.updateUserAvatar(formData).subscribe({
      next: (userResponse) => {
        if (userResponse.status === 201) {
          const img = convertBase64StringtoUrl(userResponse.imgData);
          const user: User = {
            id: userResponse.user.id,  
            firstName: userResponse.user.firstName, 
            lastName: userResponse.user.lastName, 
            email: userResponse.user.email, 
            imgUrl: img, 
          };
          console.log(user);
          this.userService.setUser(user);
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  uploadAvatar(): void {
    const files = this.avatarInputRef.nativeElement.files;
    console.log(files);
    if (files && files[0]) {
      this.uploadFileToServer(files[0]);
    }
  }

  deleteAccount(): void {
    const storedUser = this.userService.getUser();
    const authId = this.userService.getAuth0User()?.id;
    if (!authId) {
      console.log("Error deleting account")
    }
    this.userService.deleteUser(storedUser?.id!, authId).subscribe({
      next: (userResponse) => {
        if (userResponse.status === 200) {
          this.userService.clearUserAndDefaultUser();
          this.authService.logout({
            logoutParams: {
              returnTo: this.doc.location.origin,
            },
          });
        }
      },
      error: (error) => {
        window.alert(error)
      },
    });
  }
}
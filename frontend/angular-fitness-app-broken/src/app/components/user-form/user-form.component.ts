import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DefaultUser, UserService } from 'src/app/services/user.service';
import { FormValidation } from 'src/app/common/FormValidation';
import { User } from 'src/app/common/User';
import { Subscription } from 'rxjs';
import { UserDto } from 'src/app/common/UserDto';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  standalone: true,
  imports: [NgIf, ReactiveFormsModule]
})
export class UserFormComponent implements OnInit, OnDestroy {

  userFormGroup!:FormGroup
  user?: User 
  subscription!: Subscription

  constructor(private formBuilder: FormBuilder, private userService:UserService, private router:Router) {}
 
  ngOnInit(): void {
    if (!this.user) {
    this.userFormGroup = this.formBuilder.group({
      fName: new FormControl('', [Validators.required, Validators.minLength(2), FormValidation.notOnlyWhitespace]),
      lName: new FormControl('', [Validators.required, Validators.minLength(2), FormValidation.notOnlyWhitespace])
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  addUser() {
    const { fName, lName } = this.userFormGroup.value;
    const defaultUser: DefaultUser | undefined = this.userService.getDefaultUser()  
    const userDto: UserDto = { firstName: fName, lastName: lName, email: defaultUser?.email, avatar: defaultUser?.avatar };

    this.subscription = this.userService.addUser(userDto).subscribe({
      next: ((userResponse) => {
        if (userResponse.status === 201) {
          this.userService.setUser(userResponse.user);
          this.userService.removeDefaultUser()
          this.router.navigate(['exercise']);
        }
      }),
      error: ((error) => {
        console.log(error)
      })
    });
  }
  
  
  submitForm() {
    if (this.userFormGroup.invalid) {
      this.userFormGroup.markAllAsTouched()
      return
    }
    if (!this.user) {
      console.log("in submit")
      this.addUser()
    }
  }

  isFirstNameValid() {
    const userLastNameControl = this.userFormGroup.get('fName')
    return  userLastNameControl?.invalid && ( userLastNameControl.dirty || userLastNameControl.touched)
  }

  isLastNameValid() {
    const userFirstNameControl = this.userFormGroup.get('lName')
    return userFirstNameControl?.invalid && (userFirstNameControl.dirty || userFirstNameControl.touched)
    }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.userFormGroup?.get(controlName);
    return !!control?.hasError(errorType);
  }


}

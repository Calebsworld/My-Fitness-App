import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormValidation } from 'src/app/common/FormValidation';
import { User } from 'src/app/common/User';
import { Subscription, map } from 'rxjs';
import { UserDto } from 'src/app/common/UserDto';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
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
    this.subscription.unsubscribe()
  }

  addUser() {
    const { fName, lName } = this.userFormGroup.value;
    const email = this.userService.getEmail();
    const avatar = this.userService.getAvatar(); 

    const userDto: UserDto = { firstName: fName, lastName: lName, email: email, avatar: avatar };
    
    // Subscribe to the addUser method
    this.subscription = this.userService.addUser(userDto).subscribe(
      (userResponse => {
        if (userResponse.status === 201) {
          // Update user in the service
          this.userService.setUser(userResponse.user);
          
          // Navigate to the 'exercise' route
          this.router.navigate(['exercise']);
        }
      }),
      error => {
        console.error('Error adding user:', error);
      },
      () => {
        // Clean up resources if needed
        // console.log(this.userService.getUser());
        // this.subscription.unsubscribe();
      }
    );
  }
  
  
  submitForm() {
    if (this.userFormGroup.invalid) {
      this.userFormGroup.markAllAsTouched()
      return
    }
    const userId = this.userService.getUser()?.id
    if (!userId) {
      this.addUser()
    }
  }

  isFirstNameValid() {
    const userLastNameControl = this.userFormGroup.get('fNmame')
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

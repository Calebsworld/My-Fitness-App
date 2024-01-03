import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/common/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-workout-button',
  templateUrl: './create-workout-button.component.html',
  styleUrls: ['./create-workout-button.component.css']
})
export class CreateWorkoutButtonComponent implements OnInit {

  storedUser: User | null = null


  constructor(private router:Router,
              private userService: UserService) {}
  
  ngOnInit(): void {
    this.storedUser = this.userService.getUser()
  }

  // Make the routeUrl a behavior subject and use a service to update the value, then set up observers to listen to the value.
  createWorkout() {
    // if no user is stored then redirect to load/user, and then come back to this page.
    if (this.storedUser !== null) {
      this.router.navigate(['/workout-form']);
    } else {
      this.router.navigateByUrl('/load-user')
    }
  }




}

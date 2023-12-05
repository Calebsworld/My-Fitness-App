import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { tap } from 'rxjs';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Handle authentication callback
    this.auth.handleRedirectCallback().pipe(
      tap((data) => console.log(data))
    ).subscribe((data) => {
      this.router.navigate(['/load-user']);
    });
  }
}
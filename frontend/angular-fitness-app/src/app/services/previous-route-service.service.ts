// previous-route.service.ts
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {

  private previousUrl!: string;
  private currentUrl!: string;

  constructor() {}

}

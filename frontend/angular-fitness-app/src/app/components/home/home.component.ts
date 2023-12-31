import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  @ViewChild('video') videoElement!: ElementRef
  videoSource:string = "../assets/pexels-tima-miroshnichenko-6390164-1080x1920-25fps.mp4"

  constructor(private userService:UserService) {}
  ngAfterViewInit() {

    const video = this.videoElement.nativeElement;

    video.addEventListener('canplaythrough', () => {
      video.play();
    });
    


  }



}

import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  @ViewChild('video') videoElement!: ElementRef

  ngAfterViewInit() {
    const video = this.videoElement.nativeElement;

    video.addEventListener('canplaythrough', () => {
      video.play();
    });
  }
  
  videoSource:string = "../assets/pexels-tima-miroshnichenko-6390164-1080x1920-25fps.mp4"
  // videoSource:String = "../assets/pexels-tima-miroshnichenko-6390164-720x1280-25fps.mp4"


}

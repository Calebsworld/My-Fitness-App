import { Component, ElementRef, ViewChild,} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true
})
export class HomeComponent {

  @ViewChild('video') videoElement!: ElementRef
  videoSource:string = "../assets/pexels-tima-miroshnichenko-6390164-1080x1920-25fps.mp4"

  ngAfterViewInit() {
    const video = this.videoElement.nativeElement;

    video.addEventListener('canplaythrough', () => {
      video.play();
    });
  }



}

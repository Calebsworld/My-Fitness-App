import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-exercise',
  templateUrl: './search-exercise.component.html',
  styleUrls: ['./search-exercise.component.css']
})
export class SearchExerciseComponent {

  searchValue:string = ''
  wasEmpty:boolean = true
  @Output() initSearchValue = new EventEmitter<string>()

  onChange() {
    this.initSearchValue.emit(this.searchValue)
  }

  handleBackspace($event: any): void {
    if (!this.searchValue) {
      if (!this.wasEmpty) {
        // This block will execute only the first time the input becomes empty
        console.log('empty value');
        this.reset();
        this.wasEmpty = true;
      }
      $event.preventDefault();
    } else {
      // If the input is not empty, reset the flag
      this.wasEmpty = false;
    }
  }
  

  reset() {
    this.searchValue = ''
    this.initSearchValue.emit(this.searchValue.trim().toUpperCase())
  }

  

}

import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-exercise',
  templateUrl: './search-exercise.component.html',
  styleUrls: ['./search-exercise.component.css']
})
export class SearchExerciseComponent {

  searchValue:string = ''
  @Output() initSearchValue = new EventEmitter<string>()

  onChange() {
    this.initSearchValue.emit(this.searchValue)
  }

  reset() {
    this.searchValue = ''
    this.initSearchValue.emit(this.searchValue)
  }


}

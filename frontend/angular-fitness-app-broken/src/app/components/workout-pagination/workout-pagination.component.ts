import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Workout } from 'src/app/common/Workout';

@Component({
  selector: 'app-workout-pagination',
  templateUrl: './workout-pagination.component.html',
  styleUrls: ['./workout-pagination.component.css'],
  standalone: true,
  imports: [NgIf, NgbPagination, AsyncPipe, FormsModule]
})
export class WorkoutPaginationComponent implements OnChanges {

  @Input() page$!: Observable<Page>
  @Input() workouts!:Workout[]

  currentPage:number = 1
  pageSize:number = 10

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();


  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageSize']) {
      this.onPageSizeChange();
    }
  }
  
  onPageChange() {
    this.pageChange.emit(this.currentPage);
  }

  onPageSizeChange() {
    this.pageSizeChange.emit(this.pageSize);
  }

}
interface Page {
  currentPage: number,
  pageSize: number,
  totalPages: number,
  totalElements: number,
}

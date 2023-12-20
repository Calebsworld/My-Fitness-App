import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Exercise } from 'src/app/common/Exercise';

@Component({
  selector: 'app-exercise-pagination',
  templateUrl: './exercise-pagination.component.html',
  styleUrls: ['./exercise-pagination.component.css'],
  standalone: true,
  imports: [NgIf, FormsModule,  NgbModule]
})
export class ExercisePaginationComponent implements OnInit, OnChanges {

  @Input() page!: number
  @Input() pageSize!: number
  @Input() totalElements!: number
  @Input() exercises?: Exercise[]

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

 
  constructor() {}
  
  
  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageSize']) {
      this.onPageSizeChange();
    }
  }

  onPageChange() {
    this.pageChange.emit(this.page);
  }

  onPageSizeChange() {
    this.pageSizeChange.emit(this.pageSize);
  }





}

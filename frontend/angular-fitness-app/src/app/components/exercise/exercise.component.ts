import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from 'src/app/services/workout.service';
import { Workout } from 'src/app/common/Workout';
import * as uuid from "uuid"
import { Exercise } from 'src/app/common/Exercise';
import { Filter } from 'src/app/common/Filter';
import { Subject, takeUntil } from 'rxjs';
import { ExerciseService } from 'src/app/services/exercise.service';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent implements OnInit {

  public workoutId?:string
  public exercises:Exercise[] = []

  // Output to pagination
  public currentPage:number = 1
  public totalElements!:number
  public pageSize = 50
  
  #unsubscribe$ = new Subject<void>()

  public dataReceived:boolean = false;
  public filterMode:boolean = false
  public searchMode:boolean = false

  private searchValue!:string
  public workoutSuccessMessage?: string

  public pages:Exercise[][] = []
  
  public completeExerciseList:Exercise[] = []
  public filteredExerciseList:Exercise[] = []
  public previousData: Exercise[] = []
  
  private filterObj: FilterObj = {
    bodypart: {
      key: 'bodypart', value: ''
    },
    equipment: {
      key: 'equipment', value: ''
    },
    target: {
      key: 'target', value: ''
    }
  }

  constructor(private router: Router,
              private exerciseService:ExerciseService, 
              private workoutService: WorkoutService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    const data = history.state
      this.workoutId = data.workoutId
      // Put in separate component and conditionally render
      this.workoutSuccessMessage = data.successMessage 
      if (!!this.workoutSuccessMessage) {
        this.showWorkoutMessage(this.workoutSuccessMessage) 
      }
      this.exerciseService.getExercises().pipe(
      takeUntil(this.#unsubscribe$)
    ).subscribe(
      (data: Exercise[]) => {
        this.completeExerciseList = data
        this.dataReceived = true
        this.listExercises()
      }
    )
  }

    // Put the template in separate component and conditionally render the component?
    showWorkoutMessage(message?:string) {
      if (message) {
        window.scrollTo(0, 0);
        setTimeout(() => {
          this.workoutSuccessMessage = undefined
        }, 2000)
      }
    }

  createWorkout() {
    // Initialize an empty workout object
    let newWorkout: Workout = {
      id: uuid.v4(),
      name: '', 
      description: '',
      exercises: []
    };

    this.workoutService.saveWorkout(newWorkout)
    const data = { workoutId: newWorkout.id }
    // Route to the workout form and pass the ID of the new workout as a parameter
    this.router.navigate(['/workout-form'], { state: data });

  }

  listExercises(): void {
    let filteredList: Exercise[] = this.completeExerciseList

    if (this.filterMode) {
      filteredList = this.filterList(this.filterObj)
    }

    if (this.searchMode && this.searchValue) {
      filteredList = this.searchByName(filteredList)
    }
    this.totalElements = filteredList.length ?? 0
    this.loadPage(filteredList);
  }

  loadPage(data: Exercise[]) {
    this.setPages(data)
    this.displayPage()
    if (!this.isDataEqual(data, this.previousData)) {
      this.resetPage();
    }
    this.previousData = data;
  }

  setPages(data: Exercise[]) {
    this.pages = [];
    let counter = 0;
    while (counter < data.length) {
      const page = [];
      for (let i = 0; i < this.pageSize && counter < data.length; i++) {
        page.push(data[counter]);
        counter++;
      }
      this.pages.push(page);
    }
  }

  displayPage() {
    this.exercises = this.pages[this.currentPage-1]
    if (!this.exercises) {
      this.exercises = []
    }
  }
  
  isDataEqual(data1: Exercise[], data2: Exercise[]): boolean {
    if (data1.length !== data2.length) {
      return false;
    }
    for (let i = 0; i < data1.length; i++) {
      if (data1[i].id !== data2[i].id) {
        return false;
      }
    }
    return true;
  }
  
  resetPage() {
    this.currentPage = 1
  }

  updateFilterObj(filter: Filter): void {
    const filterKeys = Object.keys(this.filterObj);
    let isFilterObjEmpty = true; // Flag to track if the filter object is empty
  
    for (const key of filterKeys) {
      if (filter.key === this.filterObj[key].key) {
        this.filterObj[key].value = filter.value;
      }
  
      if (this.filterObj[key].value !== '') {
        isFilterObjEmpty = false; // At least one filter value is not empty
      }
    }
  
    this.filterMode = !isFilterObjEmpty; // Update filterMode based on the empty state of filterObj
    this.resetPage() // Reset the current page to the first page
    this.listExercises(); // Update the filtered list and pagination
  
    // Check if the filtered list is empty and reset the filter values including the input value
    if (this.exercises.length === 0) {
      for (const key of filterKeys) {
        this.filterObj[key].value = ''; // Reset the filter value to an empty string
      }
      filter.value = ''; // Reset the input value to an empty string
    }
  }
  
  filterList({ bodypart, equipment, target }: FilterObj): Exercise[] {
    let filteredList = this.completeExerciseList
    if (bodypart.value.length > 0) {
      filteredList = filteredList.filter(exercise => exercise.bodyPart.toLowerCase() === bodypart.value.toLowerCase())
    }
    if (equipment.value.length > 0) {
      filteredList = filteredList.filter(exercise => exercise.equipment.toLowerCase() === equipment.value.toLowerCase())
    }
    if (target.value.length > 0) {
      filteredList = filteredList.filter(exercise => exercise.target.toLowerCase() === target.value.toLowerCase())
    }
    return filteredList;
  }

  initSearchValue(searchValue: string): void {
    this.searchValue = searchValue;
    this.searchMode = !!searchValue; // Set search mode based on the existence of a search value
    this.listExercises(); // Update the filtered list immediately
  }

  searchByName(data:Exercise[]): Exercise[] { 
    return data.filter(exercise => exercise.name?.toLowerCase().includes(this.searchValue.toLowerCase()))
  }

  onPageChange(page:number) {
    this.currentPage = page
    this.listExercises()
  }

  onPageSizeChange(pageSize:number) {
    this.pageSize = pageSize 
    this.resetPage()
    this.listExercises()
  }



}

interface FilterObj {
  [key: string]: Filter;
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Exercise } from 'src/app/common/Exercise';
import { ExerciseService } from 'src/app/services/exercise.service';
import { Filter } from 'src/app/common/Filter';
import { ActivatedRoute } from '@angular/router';
import { WorkoutService } from 'src/app/services/workout.service';

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.css']
})
export class ExerciseListComponent implements OnInit {
  public currentPage:number = 1
  public totalElements!:number
  public pageSize = 50
  
  public pages:Exercise[][] = []
  public filteredPages:Exercise[][] = []
  
  public dataRecieved:boolean = false;

  public exercises:Exercise[] = []
  public completeExerciseList:Exercise[] = []
  public filteredExerciseList:Exercise[] = []
  public previousData: Exercise[] = []
  
  private searchValue!:string

  public filterMode:boolean = false
  public searchMode:boolean = false
  
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

  @Output() public workoutIdChanged:EventEmitter<string> = new EventEmitter<string>()
  public workoutId?:string

  public workoutSuccessMessage?: string
  public exerciseSuccessMessage?: string

  constructor(public exerciseService:ExerciseService,
              private route: ActivatedRoute, 
              private workoutService: WorkoutService) { }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.workoutId = params['workoutId']
      this.workoutSuccessMessage = params['successMessage']
      if (!!this.workoutSuccessMessage) {
        this.showWorkoutMessage(this.workoutSuccessMessage) 
      }
    })
    this.workoutIdChanged.emit(this.workoutId);

    this.exerciseService.getExercises().subscribe(
      (data: Exercise[]) => {
        this.completeExerciseList = data
        this.dataRecieved = true
        this.listExercises()
      }
    )
  }

  showWorkoutMessage(message?:string) {
    if (message) {
      window.scrollTo(0, 0);
      setTimeout(() => {
        this.workoutSuccessMessage = undefined
      }, 2000)
    }
  }

  showExerciseMessage() {
    this.exerciseSuccessMessage = 'Exercise successfully added to workout'
    window.scrollTo(0, 0);
    setTimeout(() => {
      this.exerciseSuccessMessage = undefined
    }, 3000)
  }

  listExercises(): void {
    let filteredList: Exercise[] = this.completeExerciseList

    if (this.filterMode) {
      filteredList = this.filterList(this.filterObj)
    }

    if (this.searchMode && this.searchValue) {
      filteredList = this.searchByName(filteredList)
    }

    this.loadPage(filteredList);
  }

  addToWorkout(exercise: Exercise) {
    if (this.workoutId) {
      // Add the exercise to the workout with the corresponding ID
      this.workoutService.addExerciseToWorkout(this.workoutId, exercise);
      this.showExerciseMessage()
      // Optionally, you can display a success message or perform any other necessary actions.
    } else {
      // Handle the case where there is no valid workout ID.
      // You can display an error message or prevent the user from adding the exercise.
    }
  }

  loadPage(data: Exercise[]) {
    this.totalElements = data.length || 0
    if (this.filterMode || this.searchMode) {
      this.setFilteredPages(data)
    } else {
      this.setPages(data)
    }
    this.displayPage()
    if (!this.isDataEqual(data, this.previousData)) {
      this.resetPage();
    }
    this.previousData = data;
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

  setFilteredPages(data: Exercise[]) {
    this.filteredPages = [];
    let counter = 0;
    while (counter < data.length) {
      const page = [];
      for (let i = 0; i < this.pageSize && counter < data.length; i++) {
        page.push(data[counter]);
        counter++;
      }
      this.filteredPages.push(page);
    }
  }
  
  displayPage() {
    if (this.filterMode || this.searchMode) {
      this.exercises = this.filteredPages[this.currentPage - 1];
    } else {
      this.exercises = this.pages[this.currentPage - 1];
    }
    if (!this.exercises) {
      this.exercises = []
    }
  }

  playAudio(audioUrl:string) {
    let audio = new Audio(audioUrl);
    audio.load();
    audio.play();
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

  updatePageSize() {
     this.resetPage()
     this.listExercises()
  }

}

interface FilterObj {
  [key: string]: Filter;
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Exercise } from 'src/app/common/Exercise';
import { Filter } from 'src/app/common/Filter';
import { BehaviorSubject, Observable, Subject, retry, takeUntil } from 'rxjs';
import { ExerciseService } from 'src/app/services/exercise.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent implements OnInit {

  public exercises:Exercise[] = []
  public dataReceived$ = new BehaviorSubject(false)
  public isUserSet$!: Observable<boolean> 

  private pages:Exercise[][] = []
  private completeExerciseList:Exercise[] = []
  private filteredExerciseList:Exercise[] = []
  private previousData: Exercise[] = []

  public workoutId?:number
  public exerciseId?:number
  workoutSuccessMessage?: string
  exerciseSuccessMessage?: string

  public currentPage:number = 1
  public totalElements!:number
  public pageSize = 50

  private filterMode:boolean = false
  private searchMode:boolean = false
  
  private searchValue!:string

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

  #unsubscribe$ = new Subject<void>()


  constructor(private userService:UserService,
              private exerciseService:ExerciseService, 
              private route:ActivatedRoute) {
              }

  ngOnInit(): void {
    this.isUserSet$ = this.userService.isUserSet$

    this.route.paramMap.subscribe(  
      params => {
        if (params.has('workoutId')) {
          this.workoutId = +params.get('workoutId')!
        }
        if (params.has('exerciseId')) {
          this.exerciseId = +params.get('exerciseId')!
        }
      }
    )
    if (!this.workoutId) {
      this.route.queryParams.subscribe(
        data => {
          console.log(data)
          this.workoutSuccessMessage = data['workoutSuccessMessage']
        }
      )
    }
    
    if (this.workoutSuccessMessage) {
      this.showWorkoutMessage(this.workoutSuccessMessage)
    }
  
    this.exerciseService.getExercises().pipe(
    takeUntil(this.#unsubscribe$),
    retry(3)
    ).subscribe(
      (data: Exercise[]) => {
        this.completeExerciseList = data
        this.dataReceived$.next(true)
        this.listExercises()
      }
    )
  }

  ngOnDestroy(): void {
    this.#unsubscribe$.next()
    this.#unsubscribe$.complete
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
      const page: Exercise[] = [];
      // push exercises into the inner array
      for (let i = 0; i < this.pageSize && counter < data.length; i++) {
        page.push(data[counter]);
        counter++;
      }
      // push inner array of exercises which is each page into the outer array. 
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
    const previousFilterObj = JSON.parse(JSON.stringify(this.filterObj)); // Deep copy of the current filterObj
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

  showExerciseMessage(message:string) {
    this.exerciseSuccessMessage = message 
    window.scrollTo(0, 0)
    setTimeout(() => {
      this.exerciseSuccessMessage = undefined
    }, 2000)
  }

  showWorkoutMessage(message:string) {
    window.scrollTo(0, 0);
    setTimeout(() => {
      this.workoutSuccessMessage = undefined
    }, 2000)
  }


}

interface FilterObj {
  [key: string]: Filter;
}

export interface WorkoutData {
  workoutId: number,
  workoutSuccessMessage: string
}

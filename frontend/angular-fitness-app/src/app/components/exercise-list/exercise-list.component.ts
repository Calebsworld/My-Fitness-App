import { Component, OnInit } from '@angular/core';
import { Exercise } from 'src/app/common/Exercise';
import { Filter } from 'src/app/common/Filter';
import { ExerciseService } from 'src/app/services/exercise.service';
import { OpenAiService } from 'src/app/services/openAi.service';

interface FilterObj {
  [key: string]: Filter;
}

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.css']
})
export class ExerciseListComponent implements OnInit {
  public currentPage:number = 1
  public totalElements!:number;
  public pageSize = 50;
  
  public pages:Exercise[][] = []
  public filteredPages:Exercise[][] = []
  
  public exercises:Exercise[] = []
  public completeExerciseList:Exercise[] = [];
  public filteredExerciseList:Exercise[] = []
  public previousData: Exercise[] = [];
  
  public filterMode:boolean = false;
  public searchMode:boolean = false;
  
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
  };
  private searchValue!:string 
  constructor(public exerciseService:ExerciseService,
              public openAiService: OpenAiService) { }
  
  ngOnInit(): void {
    // this.exerciseService.clearExercisesCache();
    this.exerciseService.getExercises().subscribe(
      (data: Exercise[]) => {
        this.completeExerciseList = data;
        this.listExercises()
      }
    )
  }

  listExercises(): void {
    let filteredList: Exercise[] = this.completeExerciseList;

    if (this.filterMode) {
      filteredList = this.filterCompleteExerciseList(this.filterObj);
    }

    if (this.searchMode && this.searchValue) {
      filteredList = this.searchByName(filteredList);
    }

    this.loadPage(filteredList);
  }


  loadPage(data: Exercise[]) {
    console.log("in loadPage");
    this.resetPage();
    this.totalElements = data.length;
    if (this.filterMode || this.searchMode) {
      this.setFilteredPages(data);
    } else {
      this.setPages(data);
    }
    this.displayPage();
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
    console.log("in resetPages")
    this.currentPage = 1
  }

  setPages(data: Exercise[]) {
    console.log("in setPages");
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
    this.displayPage();
  }

  setFilteredPages(data: Exercise[]) {
    console.log("in setFilteredPages");
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
    this.displayPage();
  }

  
  displayPage() {
    console.log("in displayPage");
    if (this.filterMode || this.searchMode) {
      this.exercises = this.filteredPages[this.currentPage - 1];
    } else {
      this.exercises = this.pages[this.currentPage - 1];
    }
  }

  playAudio(audioUrl:string) {
    let audio = new Audio(audioUrl);
    audio.load();
    audio.play();
  }

  // async generateAudio(instructions: string): Promise<string> {
  //   const client = new TextToSpeechClient({
  //     projectId: environment.GOOGLE_SPEECH_CREDENTIALS.project_id,
  //     credentials: {
  //       private_key: environment.GOOGLE_SPEECH_CREDENTIALS.private_key.replace(/\\n/g, '\n'),
  //       client_email: environment.GOOGLE_SPEECH_CREDENTIALS.client_email,
  //     },
  //   });
  
  //   const request = {
  //     input: { text: instructions },
  //     voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' as const },
  //     audioConfig: { audioEncoding: 'MP3' as const},
  //   };
  //   const [response] = await client.synthesizeSpeech(request);
  //   const audioContent = response.audioContent;
  //   if (!audioContent) {
  //     throw new Error('Failed to generate audio');
  //   }
  //   const audioBlob = new Blob([audioContent], { type: 'audio/mp3' });
  //   const audioUrl = URL.createObjectURL(audioBlob);
  
  //   return audioUrl;
  // }
  
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
    this.currentPage = 1; // Reset the current page to the first page
    this.listExercises(); // Update the filtered list and pagination
  
    // Check if the filtered list is empty and reset the filter values including the input value
    if (this.exercises.length === 0) {
      for (const key of filterKeys) {
        this.filterObj[key].value = ''; // Reset the filter value to an empty string
      }
      filter.value = ''; // Reset the input value to an empty string
    }
  }
  
  filterCompleteExerciseList({ bodypart, equipment, target }: FilterObj): Exercise[] {
    let filteredList = this.completeExerciseList
    if (bodypart.value.length > 0) {
      filteredList = filteredList.filter(exercise => exercise.bodyPart === bodypart.value)
    }
    if (equipment.value.length > 0) {
      filteredList = filteredList.filter(exercise => exercise.equipment === equipment.value)
    }
    if (target.value.length > 0) {
      filteredList = filteredList.filter(exercise => exercise.target === target.value)
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


}

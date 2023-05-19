import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  catchError,
  filter,
  from,
  lastValueFrom,
  map,
  of,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Configuration, OpenAIApi } from 'openai';

@Injectable({
  providedIn: 'root',
})
export class OpenAiService {

  public openAiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(public httpClient: HttpClient) {}

  // ! Lets take this code and start working on our quiz feature instead. 
  // generateInstructions(exercise: RetrievedExercise): Observable<string> {
  //   const prompt: string = `Can you please provide a brief summary of how to perform this exercise with the name: 
  //       ${exercise.name} that targets this muscle: ${exercise.target} using this piece of equipment: ${exercise.equipment}`;

  //   const body = {
  //     model: 'text-davinci-002',
  //     prompt: prompt,
  //     temperature: 0.2,
  //     max_tokens: 256,
  //   };

  //   const headers = {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${environment.openAIToken}`,
  //   };

  //   return this.httpClient.post<any>(this.openAiUrl, body, { headers }).pipe(
  //     map((resp: any) => {
  //       if (
  //         resp &&
  //         resp.choices &&
  //         resp.choices.length > 0 &&
  //         resp.choices[0].text
  //       ) {
  //         return resp.choices[0].text;
  //       } else {
  //         throw new Error('Failed to generate instructions for the exercise');
  //       }
  //     }),
  //     catchError((error) => throwError(error))
  //   );
  // }


}

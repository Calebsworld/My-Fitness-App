import { Exercise } from "./Exercise";

export interface GetExercisesResponse {
    exercises: Exercise[],
    num_of_exercises: number
}
import { Exercise } from "./Exercise";

export class Workout {

    id?:string
    name?:string
    description?:string
    exercises:Exercise[] = []

    constructor() {}

}
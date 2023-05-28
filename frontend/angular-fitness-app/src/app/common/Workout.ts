import { Exercise } from "./Exercise";

export class Workout {

    constructor(public name?:string,
                public description?:string,
                public exercises?:Exercise[]) {}

}
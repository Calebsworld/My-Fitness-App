import { Workout } from "./Workout"

export class User {

    public id?: number
    public firstName?: string
    public lastName?: string
    public email?: string
    public avatar?: string
    public workouts?: Workout[]

    constructor() {
        this.workouts = []
    }

    

}
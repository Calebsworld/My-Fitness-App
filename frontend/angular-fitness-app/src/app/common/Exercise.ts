import { WorkingSet } from "./WorkingSet";

export class Exercise {

  sets?:WorkingSet[]

  constructor(
    public id: number,
    public name: string,
    public gifUrl: string,
    public target: string,
    public bodyPart: string,
    public equipment: string
  ) {}
}
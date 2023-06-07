export class Exercise {
  
  sets?: {
    reps: number;
    weight: number;
  }[]

  constructor(
    public id: number,
    public name: string,
    public gifUrl: string,
    public target: string,
    public bodyPart: string,
    public equipment: string
  ) {}
}
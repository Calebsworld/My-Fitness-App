export class Exercise {
  sets?: number
  reps?: number
  weight?: number

  constructor(
    public id?: string,
    public name?: string,
    public gifUrl?: string,
    public target?: string,
    public bodyPart?: string,
    public equipment?: string
  ) {}
}
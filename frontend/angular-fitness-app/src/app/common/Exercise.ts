export class Exercise {
  sets: number | undefined;
  reps: number | undefined;
  weight: number | undefined;
  instructions: string | undefined;
  audioUrl: string | undefined;
  exerciseId: number | undefined;

  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public gifUrl?: string,
    public target?: string,
    public bodyPart?: string,
    public equipment?: string
  ) {}
}
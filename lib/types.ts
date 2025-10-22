export type ExerciseAPIItem = {
  name: string;
  gifUrl?: string;
  bodyPart?: string;
  equipment?: string;
  target?: string;
  instructions?: string | string[] | null;
};

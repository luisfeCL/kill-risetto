
export interface Difficulty {
  name: DifficultyType ;
  time: number;
  scorePerHit: number;
}

export type DifficultyType = 'easy' | 'medium' | 'hard'
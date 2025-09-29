import { DifficultyType } from "../game/game.interface";

export interface User {
    displayName: string,
    name: string,
    lastDifficulty: DifficultyType,
    scores: Scores
}

type Scores = Record<DifficultyType, number>; 
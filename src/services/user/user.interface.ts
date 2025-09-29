import { DifficultyType } from "../game/game.interface";

export interface User {
    id: string,
    displayName: string,
    name: string,
    lastDifficulty: DifficultyType,
    scores: Scores
}

type Scores = Record<DifficultyType, number>; 
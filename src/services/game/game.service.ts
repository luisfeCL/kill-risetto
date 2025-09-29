import { Difficulty, DifficultyType, RefName } from "./game.interface";


const difficulties: Difficulty[] = [
    { name: 'easy', time: 1000, scorePerHit: 10 },
    { name: 'medium', time: 750, scorePerHit: 20 },
    { name: 'hard', time: 500, scorePerHit: 30 }
];

export default class GameService {
    public static isGameActive: boolean = false;
    public static currenDifficulty: DifficultyType;
    private static _showTimeoutRef: number | undefined;
    private static _hideTimeoutRef: number | undefined;
    private static _activeCells: Set<number> = new Set();
    private static _currentScore: number = 0;

    private static gameStarted: string = 'game-started';
    private static gameEnded: string = 'game-ended';
    private static risettoShown: string = 'risetto-shown';
    private static risettoHidden: string = 'risetto-hidden';

    private static showRef: RefName = '_showTimeoutRef';
    private static hideRef: RefName = '_hideTimeoutRef';
    

    
    public static initGame( totalCells: number ){
        this.isGameActive = true;
        this._showTimeoutRef = window.setInterval( ()=>{ this.showRisetto( totalCells ) }, this.getInterval() )

        this._dispatchCustomEvent( this.gameStarted );
    }

    public static showRisetto( totalCells: number ){
        if( !this.isGameActive ) return;
        
        const previousCell = this._activeCells.size > 0 ? Array.from(this._activeCells)[0] : -1;

        this.hideRissetto();
        const randomCell = this._getRandomCell(previousCell, totalCells);
        this._activeCells.add( randomCell );

        this._dispatchCustomEvent(this.risettoShown, { detail: { cellIndex: randomCell } });

        this._hideTimeoutRef = window.setTimeout(() => {
            this.hideRissetto();
        }, this.getInterval());
    }

    public static hideRissetto(){
        const previousActiveCells = Array.from(this._activeCells);

        this._clearTimeout( this.hideRef )
        this._activeCells.clear();

        if (previousActiveCells.length > 0) {
            this._dispatchCustomEvent(this.risettoHidden, { detail: { cellIndexes: previousActiveCells[0] } });
        }
    }

    public static endGame(){
        this.isGameActive = false;
        this._clearTimeout( this.showRef );
        this._clearTimeout( this.hideRef );
        this.hideRissetto();
        this._dispatchCustomEvent( this.gameEnded );
        this._currentScore = 0;
    }
    
    public static getDifficulties(){
        return difficulties;
    }
    
    public static getInterval(){
        const currentDifficulty = this.getDificultyData( this.currenDifficulty );
        return currentDifficulty?.time;
    }
    
    public static updateDifficulty( difficulty: DifficultyType){
        this.currenDifficulty = difficulty;
    }
    
    public static updateScore(){
        const difficulty = this.getDificultyData( this.currenDifficulty);
        const points = difficulty?.scorePerHit || 10;
        
        this._currentScore = this._currentScore + points;
    }

    public static getCurrentScore(){
        return this._currentScore
    }
    
    // métodos privados
    private static getDificultyData( difficulty: DifficultyType ){
        const diffData = difficulties.find( diff => diff.name === difficulty)
        return diffData
    }

    private static _getRandomCell(previousCell: number | undefined, totalCells: number): number {
        let randomCell;
        
        do {
            randomCell = Math.floor(Math.random() * totalCells);
        } while (randomCell === previousCell);

        return randomCell
    }

    private static _clearTimeout(refName: RefName) {
        const ref = this[refName];
        if (ref) {
            clearTimeout(ref);
            this[ refName ] = undefined;
        }
    }

    private static _dispatchCustomEvent( eventName: string, eventData?: CustomEventInit<unknown> | undefined ){
        const data = {
            detail: eventData?.detail ?? undefined,
            bubbles: eventData?.bubbles ?? true,
            composed: eventData?.composed ?? true
        }
        dispatchEvent(new CustomEvent( eventName, data ));
    }
}
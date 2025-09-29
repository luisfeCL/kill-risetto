import { Difficulty, DifficultyType } from "./game.interface";


const difficulties: Difficulty[] = [
    { name: 'easy', time: 1000, scorePerHit: 10 },
    { name: 'medium', time: 750, scorePerHit: 20 },
    { name: 'hard', time: 500, scorePerHit: 30 }
];

export default class GameService {
    public static isGameActive: boolean = false;
    public static currenDifficulty: DifficultyType;
    private static _showIntervalRef: number | undefined;
    private static _hideTimeoutRef: number | undefined;
    private static _activeCells: Set<number> = new Set();
    private static _currentScore: number = 0;
    
    public static initGame( totalCells: number ){
        this.isGameActive = true;
        this._showIntervalRef = window.setInterval( ()=>{ this.showRisetto( totalCells ) }, this.getInterval() )

        this._dispatchCustomEvent( 'game-started' );
    }

    public static showRisetto( totalCells: number ){
        if( !this.isGameActive ) return;
        
        const previousCell = this._activeCells.size > 0 ? Array.from(this._activeCells)[0] : -1;

        this.hideRissetto();
        const randomCell = this._getRandomCell(previousCell, totalCells);
        this._activeCells.add( randomCell );

        this._dispatchCustomEvent('risetto-shown', { detail: { cellIndex: randomCell } });

        this._hideTimeoutRef = window.setTimeout(() => {
            this.hideRissetto();
        }, this.getInterval());
    }

    public static hideRissetto(){
        const previousActiveCells = Array.from(this._activeCells);

        this._clearTimeout( '_hideTimeoutRef' )
        this._activeCells.clear();

        if (previousActiveCells.length > 0) {
            this._dispatchCustomEvent('risetto-hidden', { detail: { cellIndexes: previousActiveCells[0] } });
        }
    }

    public static endGame(){
        this.isGameActive = false;
        this._clearTimeout( '_showIntervalRef' );
        this._clearTimeout( '_hideTimeoutRef' );
        this.hideRissetto();
        this._dispatchCustomEvent('game-ended');
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

    private static _clearTimeout(refName: "_hideTimeoutRef" | "_showIntervalRef") {
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
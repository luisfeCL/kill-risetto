import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { GameBoardStyles } from "./GameBoard.styles";

import '../game-cell/GameCell';
import '../../shared/components/button/CustomButton';
import GameService from "../../services/game/game.service";
import UserService from "../../services/user/user-data.service";

@customElement ( 'game-board' )
export class GameBard extends LitElement{

  static styles = [ GameBoardStyles ];

  private gamePausedLabel: string = 'Start!';
  private gameRunningLabel: string = 'Stop!';
  private risettoShownEvent: string = 'risetto-shown';
  private risettohiddenEvent: string = 'risetto-hidden';
  private hitEvent: string = 'mole-hit';
  private onDifficultySelected: string = 'value-selected';

  @property({ type: Number }) rows = 3;
  @property({ type: Number }) columns = 3;
  
  @state() private _activeCells: number[] = [];
  
  connectedCallback(): void {
    super.connectedCallback();
    this.initListeners(); 
  }
  
  private _getTotalCells(): number {
    return this.rows * this.columns;
  };

  private _handleClick(){
    GameService.isGameActive ? GameService.endGame() : GameService.initGame( this._getTotalCells() );
    this.requestUpdate();
  }

  private _getText(){
    return GameService.isGameActive ? this.gameRunningLabel : this.gamePausedLabel;
  }

  private _showRisetto = (e: CustomEvent<{ cellIndex: number }>) => {
    this._activeCells = [ e.detail.cellIndex ]; 
  }

  private _hideRisetto = () => {
    this._activeCells = []; 
  }

  private _handleChangeDifficulty = () =>{
    this.requestUpdate()
  }

  private _handleHit = () => {
    GameService.updateScore();
    this.requestUpdate();
  }

  render() {
    const totalCells = this.rows * this.columns;
    const cells = Array.from({ length: totalCells }, (_, i) => i );
  
    return html`
      <h2>Max score: ${ UserService.getMaxScore()}</h2>
      <h2>Score: ${ GameService.getCurrentScore() }</h2>
      <div
        class="grid"
        style="grid-template-columns: repeat(${this.columns}, 1fr);
               grid-template-rows: repeat(${this.rows}, 1fr);"
      >
        ${cells.map((cell) => html`
          <game-cell 
            .active=${this._activeCells.includes(cell)} 
            .cellIndex=${cell}>
          </game-cell>
        `)}
      </div>

      <custom-button 
        @click=${this._handleClick }
        label=${ this._getText() }>
      </custom-button>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeListeners();
  }

  private initListeners(){
    window.addEventListener( this.risettoShownEvent, this._showRisetto as EventListener );
    window.addEventListener( this.risettohiddenEvent, this._hideRisetto as EventListener );
    window.addEventListener( this.hitEvent, this._handleHit as EventListener );
    window.addEventListener( this.onDifficultySelected, this._handleChangeDifficulty as EventListener );
  }
  
  private removeListeners(){
    window.removeEventListener( this.risettoShownEvent, this._showRisetto as EventListener );
    window.removeEventListener( this.risettohiddenEvent, this._hideRisetto as EventListener );
    window.removeEventListener( this.hitEvent, this._handleHit as EventListener );
    window.removeEventListener( this.onDifficultySelected, this._handleChangeDifficulty as EventListener );
  }
}
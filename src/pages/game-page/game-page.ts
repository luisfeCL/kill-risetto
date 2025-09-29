import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
// import { PreventAndRedirectCommands, RedirectResult, Router, RouterLocation } from "@vaadin/router";

import { GamePageStyles } from "./game-page.styles";
import UserService from "../../services/user/user-data.service";
import GameService from "../../services/game/game.service";
import { DifficultyType } from "../../services/game/game.interface";

import '../../shared/components/select/CustomSelect'
import '../../game/game-board/GameBoard'
import { PreventAndRedirectCommands, RedirectResult, Router, RouterLocation } from "@vaadin/router";

@customElement( 'game-page' )
export class GamePage extends LitElement{
    static styles = [ GamePageStyles ]
    
  private _currentUser = UserService.currentUser
  private difficulties = GameService.getDifficulties().map(({ name }) => ({
    value: name,
    label: name
  }));

  @state() private currentDifficulty: DifficultyType = this._currentUser?.lastDifficulty || 'easy';

  // onBeforeEnter(
  //     _location: RouterLocation,
  //     commands: PreventAndRedirectCommands,
  //     _router: Router
  // ): RedirectResult | undefined {
  //     if(!this.isAuthorized()) {
  //       return commands.redirect('/');
  //     }
  // }

  private isAuthorized() {
    if (!UserService.currentUser) return false;
    return true;
  }

  private _handleDifficultyChange(e: CustomEvent) {
    this.currentDifficulty = e.detail.value || 'easy';
    if( this.currentDifficulty ) GameService.updateDifficulty( this.currentDifficulty );
    if( GameService.isGameActive ) GameService.endGame();
    UserService.updateUserData( this.currentDifficulty );
    this.requestUpdate()
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.initListeners();
  }
  
  protected firstUpdated(): void {
    if( this.currentDifficulty ) GameService.updateDifficulty( this.currentDifficulty );
  }

  private _handleEndGame(){
    const currenDifficulty = GameService.currenDifficulty;
    const currentScore = GameService.getCurrentScore()

    UserService.updateUserData( currenDifficulty, currentScore  );
  }

    render(){
        return html`
            <header>
                <div class="player-info">
                    <img width="32" src='/images/profile.png' alt="Foto de perfil del jugador" />
                    <span class="player-name">${ UserService.currentUser?.displayName }</span>
                </div>

                ${ this.renderSelect()}
            </header>

            <section>
                <game-board .difficulty=${ this.currentDifficulty }></game-board>
            </section>
        `
    }

  private renderSelect(){
    return html`
      <custom-select
          .value=${ this.currentDifficulty }
          .options=${this.difficulties}
          label="Level"
          name="difficulty"
          id="difficulty-select"
          @value-selected=${ this._handleDifficultyChange }
      ></custom-select>
    `
  }

  disconnectedCallback(): void {
    if( GameService.isGameActive ) GameService.endGame();
    this.removeListeners();
  }

  private initListeners(){
    window.addEventListener('game-ended', this._handleEndGame );
  }

  private removeListeners(){
    window.removeEventListener('game-ended', this._handleEndGame );
  } 
}
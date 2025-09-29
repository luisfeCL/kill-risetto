import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { PreventAndRedirectCommands, RedirectResult, Router, RouterLocation } from "@vaadin/router";

import { GamePageStyles } from "./game-page.styles";
import UserService from "../../services/user/user-data.service";
import GameService from "../../services/game/game.service";
import { DifficultyType } from "../../services/game/game.interface";

import '../../shared/components/select/CustomSelect'
import '../../game/game-board/GameBoard'

@customElement( 'game-page' )
export class GamePage extends LitElement{

  static styles = [ GamePageStyles ];

  private gameEndedEvent: string = 'game-ended'; 
  private defaultDifficulty: DifficultyType = 'easy';
  private profilePic: string = '/images/profile.png';
  private altText = 'User Profile pic';
  private profilePicSize: number = 32; 
  private _currentUser = UserService.currentUser
  private difficulties = GameService.getDifficulties().map(({ name }) => ({
    value: name,
    label: name
  }));

  @state() private currentDifficulty: DifficultyType = this._currentUser?.lastDifficulty || this.defaultDifficulty;

  onBeforeEnter(
      _location: RouterLocation,
      commands: PreventAndRedirectCommands,
      _router: Router
  ): RedirectResult | undefined {
      if(!this.isAuthorized()) {
        return commands.redirect('/');
      }
  }

  private isAuthorized() {
    if (!UserService.currentUser) return false;
    return true;
  }

  private _handleDifficultyChange(e: CustomEvent) {
    this.currentDifficulty = e.detail.value || this.defaultDifficulty;
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

  private _handleLogoClick(){
    Router.go('/')
  }

    render(){
        return html`
            
            ${this.renderHeader()}
            ${ this.renderGame() }
           
        `
    }

  private renderHeader(){
    return html`
      <header>
          <div class="player-info">
              <img role='button' @click=${ this._handleLogoClick } width=${ this.profilePicSize } src=${ this.profilePic } alt=${ this.altText } />
              <span class="player-name">${ UserService.currentUser?.displayName }</span>
          </div>

          ${ this.renderSelect()}
      </header>
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

  private renderGame(){
    return html`
      <section>
          <game-board .difficulty=${ this.currentDifficulty }></game-board>
      </section>
    `
  }

  disconnectedCallback(): void {
    if( GameService.isGameActive ) GameService.endGame();
    this.removeListeners();
  }

  private initListeners(){
    window.addEventListener(this.gameEndedEvent, this._handleEndGame );
  }

  private removeListeners(){
    window.removeEventListener(this.gameEndedEvent, this._handleEndGame );
  } 
}
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../../src/pages/game-page/game-page';
import UserService from '../../../src/services/user/user-data.service';
import GameService from '../../../src/services/game/game.service';

describe('GamePage', () => {
  let element: any;

  beforeEach(() => {
    UserService.currentUser = {
      id: crypto.randomUUID(),
      name: 'testuser',
      displayName: 'TestUser',
      scores: { easy: 0, medium: 0, hard: 0 },
      lastDifficulty: 'easy'
    };
    GameService.isGameActive = false;
    
    element = document.createElement('game-page');
    document.body.appendChild(element);
  });

  afterEach(() => {
    if (GameService.isGameActive) {
      GameService.endGame();
    }
    document.body.removeChild(element);
    UserService.currentUser = null;
  });

  it('should render the component', async () => {
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  it('should render the header', async () => {
    await element.updateComplete;
    const header = element.shadowRoot.querySelector('header');
    expect(header).toBeTruthy();
  });

  it('should render the profile image', async () => {
    await element.updateComplete;
    const img = element.shadowRoot.querySelector('.player-info img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('/images/profile.png');
  });

  it('should render the player name', async () => {
    await element.updateComplete;
    const playerName = element.shadowRoot.querySelector('.player-name');
    expect(playerName?.textContent).toBe('TestUser');
  });

  it('should render the custom-select', async () => {
    await element.updateComplete;
    const select = element.shadowRoot.querySelector('custom-select');
    expect(select).toBeTruthy();
  });

  it('should render the game-board', async () => {
    await element.updateComplete;
    const gameBoard = element.shadowRoot.querySelector('game-board');
    expect(gameBoard).toBeTruthy();
  });

  it('should have currentDifficulty easy by default', () => {
    expect(element.currentDifficulty).toBe('easy');
  });

  it('should use the user\'s lastDifficulty if it exists', () => {
    UserService.currentUser!.lastDifficulty = 'hard';
    
    const newElement: any = document.createElement('game-page');
    
    expect(newElement.currentDifficulty).toBe('hard');
  });

  it('should be authorized if there is a current user', () => {
    expect(element.isAuthorized()).toBe(true);
  });

  it('should not be authorized if there is no current user', () => {
    UserService.currentUser = null;
    expect(element.isAuthorized()).toBe(false);
  });

  it('should update the difficulty in GameService on mount', () => {
    const updateSpy = vi.spyOn(GameService, 'updateDifficulty');
    
    const newElement: any = document.createElement('game-page');
    document.body.appendChild(newElement);
    
    newElement.firstUpdated();
    
    expect(updateSpy).toHaveBeenCalledWith('easy');
    document.body.removeChild(newElement);
  });

  it('should update currentDifficulty when changed', async () => {
    await element.updateComplete;
    
    const event = new CustomEvent('value-selected', {
      detail: { value: 'hard' }
    });
    
    element._handleDifficultyChange(event);
    
    expect(element.currentDifficulty).toBe('hard');
  });

  it('should call GameService.updateDifficulty', async () => {
    const updateSpy = vi.spyOn(GameService, 'updateDifficulty');
    await element.updateComplete;
    
    const event = new CustomEvent('value-selected', {
      detail: { value: 'medium' }
    });
    
    element._handleDifficultyChange(event);
    
    expect(updateSpy).toHaveBeenCalledWith('medium');
  });

  it('should end the game if active when changing difficulty', async () => {
    GameService.isGameActive = true;
    const endGameSpy = vi.spyOn(GameService, 'endGame');
    await element.updateComplete;
    
    const event = new CustomEvent('value-selected', {
      detail: { value: 'hard' }
    });
    
    element._handleDifficultyChange(event);
    
    expect(endGameSpy).toHaveBeenCalled();
  });

  it('should update UserService with the new difficulty', async () => {
    const updateSpy = vi.spyOn(UserService, 'updateUserData');
    await element.updateComplete;
    
    const event = new CustomEvent('value-selected', {
      detail: { value: 'medium' }
    });
    
    element._handleDifficultyChange(event);
    
    expect(updateSpy).toHaveBeenCalledWith('medium');
  });

  it('should update UserService when the game ends', async () => {
    const updateSpy = vi.spyOn(UserService, 'updateUserData');
    GameService.currenDifficulty = 'easy';
    GameService['_currentScore'] = 150;
    
    await element.updateComplete;
    element._handleEndGame();
    
    expect(updateSpy).toHaveBeenCalledWith('easy', 150);
  });

  it('should end the game on disconnect if it is active', () => {
    GameService.isGameActive = true;
    const endGameSpy = vi.spyOn(GameService, 'endGame');
    
    element.disconnectedCallback();
    
    expect(endGameSpy).toHaveBeenCalled();
  });

 it('should listen for the game-ended event', async () => {
    const updateSpy = vi.spyOn(UserService, 'updateUserData');
    GameService.currenDifficulty = 'easy';
    GameService['_currentScore'] = 100;
    
    await element.updateComplete;
    
    window.dispatchEvent(new CustomEvent('game-ended'));
    
    expect(updateSpy).toHaveBeenCalled();
  });
});
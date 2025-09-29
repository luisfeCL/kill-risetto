import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../../src/pages/game-page/game-page';
import UserService from '../../../src/services/user/user-data.service';
import GameService from '../../../src/services/game/game.service';

describe('GamePage', () => {
  let element: any;

  beforeEach(() => {
    UserService.currentUser = {
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

  // render

  it('debería renderizar el componente', async () => {
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  it('debería renderizar el header', async () => {
    await element.updateComplete;
    const header = element.shadowRoot.querySelector('header');
    expect(header).toBeTruthy();
  });

  it('debería renderizar la imagen de perfil', async () => {
    await element.updateComplete;
    const img = element.shadowRoot.querySelector('.player-info img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('/images/profile.png');
  });

  it('debería renderizar el nombre del jugador', async () => {
    await element.updateComplete;
    const playerName = element.shadowRoot.querySelector('.player-name');
    expect(playerName?.textContent).toBe('TestUser');
  });

  it('debería renderizar el custom-select', async () => {
    await element.updateComplete;
    const select = element.shadowRoot.querySelector('custom-select');
    expect(select).toBeTruthy();
  });

  it('debería renderizar el game-board', async () => {
    await element.updateComplete;
    const gameBoard = element.shadowRoot.querySelector('game-board');
    expect(gameBoard).toBeTruthy();
  });

  // valores por defecto

  it('debería tener currentDifficulty easy por defecto', () => {
    expect(element.currentDifficulty).toBe('easy');
  });

  it('debería usar lastDifficulty del usuario si existe', () => {
    UserService.currentUser!.lastDifficulty = 'hard';
    
    const newElement: any = document.createElement('game-page');
    
    expect(newElement.currentDifficulty).toBe('hard');
  });

  // isAuthorized

  it('debería estar autorizado si hay usuario actual', () => {
    expect(element.isAuthorized()).toBe(true);
  });

  it('no debería estar autorizado si no hay usuario actual', () => {
    UserService.currentUser = null;
    expect(element.isAuthorized()).toBe(false);
  });

  // firstUpdated

  it('debería actualizar la dificultad en GameService al montar', () => {
    const updateSpy = vi.spyOn(GameService, 'updateDifficulty');
    
    const newElement: any = document.createElement('game-page');
    document.body.appendChild(newElement);
    
    // Forzar firstUpdated manualmente
    newElement.firstUpdated();
    
    expect(updateSpy).toHaveBeenCalledWith('easy');
    document.body.removeChild(newElement);
  });

  // _handleDifficultyChange

  it('debería actualizar currentDifficulty al cambiar', async () => {
    await element.updateComplete;
    
    const event = new CustomEvent('value-selected', {
      detail: { value: 'hard' }
    });
    
    element._handleDifficultyChange(event);
    
    expect(element.currentDifficulty).toBe('hard');
  });

  it('debería actualizar GameService.updateDifficulty', async () => {
    const updateSpy = vi.spyOn(GameService, 'updateDifficulty');
    await element.updateComplete;
    
    const event = new CustomEvent('value-selected', {
      detail: { value: 'medium' }
    });
    
    element._handleDifficultyChange(event);
    
    expect(updateSpy).toHaveBeenCalledWith('medium');
  });

  it('debería terminar el juego si está activo al cambiar dificultad', async () => {
    GameService.isGameActive = true;
    const endGameSpy = vi.spyOn(GameService, 'endGame');
    await element.updateComplete;
    
    const event = new CustomEvent('value-selected', {
      detail: { value: 'hard' }
    });
    
    element._handleDifficultyChange(event);
    
    expect(endGameSpy).toHaveBeenCalled();
  });

  it('debería actualizar UserService con la nueva dificultad', async () => {
    const updateSpy = vi.spyOn(UserService, 'updateUserData');
    await element.updateComplete;
    
    const event = new CustomEvent('value-selected', {
      detail: { value: 'medium' }
    });
    
    element._handleDifficultyChange(event);
    
    expect(updateSpy).toHaveBeenCalledWith('medium');
  });

  // _handleEndGame

  it('debería actualizar UserService al terminar el juego', async () => {
    const updateSpy = vi.spyOn(UserService, 'updateUserData');
    GameService.currenDifficulty = 'easy';
    GameService['_currentScore'] = 150;
    
    await element.updateComplete;
    element._handleEndGame();
    
    expect(updateSpy).toHaveBeenCalledWith('easy', 150);
  });

  // disconnectedCallback

  it('debería terminar el juego al desmontar si está activo', () => {
    GameService.isGameActive = true;
    const endGameSpy = vi.spyOn(GameService, 'endGame');
    
    element.disconnectedCallback();
    
    expect(endGameSpy).toHaveBeenCalled();
  });

  // eventos

 it('debería escuchar el evento game-ended', async () => {
    const updateSpy = vi.spyOn(UserService, 'updateUserData');
    GameService.currenDifficulty = 'easy';
    GameService['_currentScore'] = 100;
    
    await element.updateComplete;
    
    window.dispatchEvent(new CustomEvent('game-ended'));
    
    expect(updateSpy).toHaveBeenCalled();
  });
});
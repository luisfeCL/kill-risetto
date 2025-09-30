import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import GameService from '../../../src/services/game/game.service';

describe('GameService', () => {
  beforeEach(() => {
    GameService.isGameActive = false;
    GameService['_currentScore'] = 0;
    GameService['_activeCells'] = new Set();
    GameService.currenDifficulty = 'easy';
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  afterEach(() => {
    if (GameService.isGameActive) {
      GameService.endGame();
    }
  });

  it('should have isGameActive false by default', () => {
    expect(GameService.isGameActive).toBe(false);
  });

  it('should have _currentScore at 0 by default', () => {
    expect(GameService.getCurrentScore()).toBe(0);
  });

  it('should activate the game on start', () => {
    GameService.initGame(9);
    
    expect(GameService.isGameActive).toBe(true);
  });

  it('should dispatch game-started event', () => {
    const eventListener = vi.fn();
    window.addEventListener('game-started', eventListener);
    
    GameService.initGame(9);
    
    expect(eventListener).toHaveBeenCalled();
    window.removeEventListener('game-started', eventListener);
  });

  it('should deactivate the game on end', () => {
    GameService.initGame(9);
    GameService.endGame();
    
    expect(GameService.isGameActive).toBe(false);
  });

  it('should reset the score on end', () => {
    GameService['_currentScore'] = 100;
    GameService.endGame();
    
    expect(GameService.getCurrentScore()).toBe(0);
  });

  it('should dispatch game-ended event', () => {
    const eventListener = vi.fn();
    window.addEventListener('game-ended', eventListener);
    
    GameService.initGame(9);
    GameService.endGame();
    
    expect(eventListener).toHaveBeenCalled();
    window.removeEventListener('game-ended', eventListener);
  });

  it('should return array of difficulties', () => {
    const difficulties = GameService.getDifficulties();
    
    expect(difficulties).toHaveLength(3);
    expect(difficulties[0].name).toBe('easy');
  });

  it('should return 1000ms for easy', () => {
    GameService.updateDifficulty('easy');
    
    expect(GameService.getInterval()).toBe(1000);
  });

  it('should return 750ms for medium', () => {
    GameService.updateDifficulty('medium');
    
    expect(GameService.getInterval()).toBe(750);
  });

  it('should return 500ms for hard', () => {
    GameService.updateDifficulty('hard');
    
    expect(GameService.getInterval()).toBe(500);
  });

  it('should update the difficulty', () => {
    GameService.updateDifficulty('hard');
    
    expect(GameService.currenDifficulty).toBe('hard');
  });

  it('should increment score according to easy difficulty', () => {
    GameService.updateDifficulty('easy');
    GameService.updateScore();
    
    expect(GameService.getCurrentScore()).toBe(10);
  });

  it('should increment score according to medium difficulty', () => {
    GameService.updateDifficulty('medium');
    GameService.updateScore();
    
    expect(GameService.getCurrentScore()).toBe(20);
  });

  it('should increment score according to hard difficulty', () => {
    GameService.updateDifficulty('hard');
    GameService.updateScore();
    
    expect(GameService.getCurrentScore()).toBe(30);
  });

  it('should accumulate the score correctly', () => {
    GameService.updateDifficulty('easy');
    GameService.updateScore();
    GameService.updateScore();
    
    expect(GameService.getCurrentScore()).toBe(20);
  });

  it('should return the current score', () => {
    GameService['_currentScore'] = 150;
    
    expect(GameService.getCurrentScore()).toBe(150);
  });

  it('should clear active cells', () => {
    GameService['_activeCells'].add(3);
    GameService.hideRissetto();
    
    expect(GameService['_activeCells'].size).toBe(0);
  });

  it('should dispatch risetto-hidden event if there were active cells', () => {
    const eventListener = vi.fn();
    window.addEventListener('risetto-hidden', eventListener);
    
    GameService['_activeCells'].add(5);
    GameService.hideRissetto();
    
    expect(eventListener).toHaveBeenCalled();
    window.removeEventListener('risetto-hidden', eventListener);
  });
});
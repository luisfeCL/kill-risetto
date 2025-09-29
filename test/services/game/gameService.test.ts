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

  // valores por defecto

  it('debería tener isGameActive false por defecto', () => {
    expect(GameService.isGameActive).toBe(false);
  });

  it('debería tener _currentScore en 0 por defecto', () => {
    expect(GameService.getCurrentScore()).toBe(0);
  });

  // initGame

  it('debería activar el juego al iniciar', () => {
    GameService.initGame(9);
    
    expect(GameService.isGameActive).toBe(true);
  });

  it('debería disparar evento game-started', () => {
    const eventListener = vi.fn();
    window.addEventListener('game-started', eventListener);
    
    GameService.initGame(9);
    
    expect(eventListener).toHaveBeenCalled();
    window.removeEventListener('game-started', eventListener);
  });

  // endGame

  it('debería desactivar el juego al terminar', () => {
    GameService.initGame(9);
    GameService.endGame();
    
    expect(GameService.isGameActive).toBe(false);
  });

  it('debería resetear el score al terminar', () => {
    GameService['_currentScore'] = 100;
    GameService.endGame();
    
    expect(GameService.getCurrentScore()).toBe(0);
  });

  it('debería disparar evento game-ended', () => {
    const eventListener = vi.fn();
    window.addEventListener('game-ended', eventListener);
    
    GameService.initGame(9);
    GameService.endGame();
    
    expect(eventListener).toHaveBeenCalled();
    window.removeEventListener('game-ended', eventListener);
  });

  // getDifficulties

  it('debería devolver array de dificultades', () => {
    const difficulties = GameService.getDifficulties();
    
    expect(difficulties).toHaveLength(3);
    expect(difficulties[0].name).toBe('easy');
  });

  // getInterval

  it('debería devolver 1000ms para easy', () => {
    GameService.updateDifficulty('easy');
    
    expect(GameService.getInterval()).toBe(1000);
  });

  it('debería devolver 750ms para medium', () => {
    GameService.updateDifficulty('medium');
    
    expect(GameService.getInterval()).toBe(750);
  });

  it('debería devolver 500ms para hard', () => {
    GameService.updateDifficulty('hard');
    
    expect(GameService.getInterval()).toBe(500);
  });

  // updateDifficulty

  it('debería actualizar la dificultad', () => {
    GameService.updateDifficulty('hard');
    
    expect(GameService.currenDifficulty).toBe('hard');
  });

  // updateScore

  it('debería incrementar score según dificultad easy', () => {
    GameService.updateDifficulty('easy');
    GameService.updateScore();
    
    expect(GameService.getCurrentScore()).toBe(10);
  });

  it('debería incrementar score según dificultad medium', () => {
    GameService.updateDifficulty('medium');
    GameService.updateScore();
    
    expect(GameService.getCurrentScore()).toBe(20);
  });

  it('debería incrementar score según dificultad hard', () => {
    GameService.updateDifficulty('hard');
    GameService.updateScore();
    
    expect(GameService.getCurrentScore()).toBe(30);
  });

  it('debería acumular el score correctamente', () => {
    GameService.updateDifficulty('easy');
    GameService.updateScore();
    GameService.updateScore();
    
    expect(GameService.getCurrentScore()).toBe(20);
  });

  // getCurrentScore

  it('debería devolver el score actual', () => {
    GameService['_currentScore'] = 150;
    
    expect(GameService.getCurrentScore()).toBe(150);
  });

  // hideRissetto

  it('debería limpiar las celdas activas', () => {
    GameService['_activeCells'].add(3);
    GameService.hideRissetto();
    
    expect(GameService['_activeCells'].size).toBe(0);
  });

  it('debería disparar evento risetto-hidden si había celdas activas', () => {
    const eventListener = vi.fn();
    window.addEventListener('risetto-hidden', eventListener);
    
    GameService['_activeCells'].add(5);
    GameService.hideRissetto();
    
    expect(eventListener).toHaveBeenCalled();
    window.removeEventListener('risetto-hidden', eventListener);
  });
});
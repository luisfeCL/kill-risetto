import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../../src/game/game-board/GameBoard';
import GameService from '../../../src/services/game/game.service';


vi.mock('../../../src/services/user/user-data.service', () => ({
  default: {
    getMaxScore: vi.fn(() => 0)
  }
}));

describe('GameBoard', () => {
  let element: any;

  beforeEach(() => {
    GameService.isGameActive = false;
    GameService['_currentScore'] = 0;
    
    element = document.createElement('game-board');
    document.body.appendChild(element);
  });

  afterEach(() => {
    if (GameService.isGameActive) {
      GameService.endGame();
    }
    document.body.removeChild(element);
  });

  // render

  it('debería renderizar el componente', async () => {
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  it('debería renderizar el grid', async () => {
    await element.updateComplete;
    const grid = element.shadowRoot.querySelector('.grid');
    expect(grid).toBeTruthy();
  });

  it('debería renderizar el custom-button', async () => {
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('custom-button');
    expect(button).toBeTruthy();
  });

  // valores por defecto

  it('debería tener rows 3 por defecto', () => {
    expect(element.rows).toBe(3);
  });

  it('debería tener columns 3 por defecto', () => {
    expect(element.columns).toBe(3);
  });

  it('debería tener _activeCells vacío por defecto', () => {
    expect(element._activeCells).toEqual([]);
  });

  // celdas

  it('debería renderizar 9 celdas por defecto (3x3)', async () => {
    await element.updateComplete;
    const cells = element.shadowRoot.querySelectorAll('game-cell');
    expect(cells.length).toBe(9);
  });

  it('debería renderizar el número correcto de celdas según rows y columns', async () => {
    element.rows = 4;
    element.columns = 5;
    await element.updateComplete;
    
    const cells = element.shadowRoot.querySelectorAll('game-cell');
    expect(cells.length).toBe(20);
  });

  it('debería activar la celda correcta cuando se actualiza _activeCells', async () => {
    element._activeCells = [2];
    await element.updateComplete;
    
    const cells = element.shadowRoot.querySelectorAll('game-cell');
    expect(cells[2].active).toBe(true);
    expect(cells[0].active).toBe(false);
  });

  // botón

  it('debería mostrar "Start!" cuando el juego no está activo', async () => {
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('custom-button');
    expect(button?.label).toBe('Start!');
  });

  it('debería mostrar "Stop!" cuando el juego está activo', async () => {
    GameService.isGameActive = true;
    element.requestUpdate();
    await element.updateComplete;
    
    const button = element.shadowRoot.querySelector('custom-button');
    expect(button?.label).toBe('Stop!');
  });

  // eventos

  it('debería activar la celda cuando se dispara risetto-shown', async () => {
    await element.updateComplete;
    
    const event = new CustomEvent('risetto-shown', {
      detail: { cellIndex: 5 }
    });
    
    window.dispatchEvent(event);
    await element.updateComplete;
    
    expect(element._activeCells).toEqual([5]);
  });

  it('debería limpiar las celdas activas cuando se dispara risetto-hidden', async () => {
    element._activeCells = [2, 4];
    await element.updateComplete;
    
    window.dispatchEvent(new CustomEvent('risetto-hidden'));
    await element.updateComplete;
    
    expect(element._activeCells).toEqual([]);
  });

  it('debería actualizar el score cuando se dispara mole-hit', async () => {
    const updateScoreSpy = vi.spyOn(GameService, 'updateScore');
    await element.updateComplete;
    
    window.dispatchEvent(new CustomEvent('mole-hit'));
    
    expect(updateScoreSpy).toHaveBeenCalled();
  });
});
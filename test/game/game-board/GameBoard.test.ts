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

  it('should render the component', async () => {
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  it('should render the grid', async () => {
    await element.updateComplete;
    const grid = element.shadowRoot.querySelector('.grid');
    expect(grid).toBeTruthy();
  });

  it('should render the custom-button', async () => {
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('custom-button');
    expect(button).toBeTruthy();
  });

  it('should have rows 3 by default', () => {
    expect(element.rows).toBe(3);
  });

  it('should have columns 3 by default', () => {
    expect(element.columns).toBe(3);
  });

  it('should have _activeCells empty by default', () => {
    expect(element._activeCells).toEqual([]);
  });

  it('should render 9 cells by default (3x3)', async () => {
    await element.updateComplete;
    const cells = element.shadowRoot.querySelectorAll('game-cell');
    expect(cells.length).toBe(9);
  });

  it('should render the correct number of cells according to rows and columns', async () => {
    element.rows = 4;
    element.columns = 5;
    await element.updateComplete;
    
    const cells = element.shadowRoot.querySelectorAll('game-cell');
    expect(cells.length).toBe(20);
  });

  it('should activate the correct cell when _activeCells is updated', async () => {
    element._activeCells = [2];
    await element.updateComplete;
    
    const cells = element.shadowRoot.querySelectorAll('game-cell');
    expect(cells[2].active).toBe(true);
    expect(cells[0].active).toBe(false);
  });

  it('should display "Start!" when the game is not active', async () => {
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('custom-button');
    expect(button?.label).toBe('Start!');
  });

  it('should display "Stop!" when the game is active', async () => {
    GameService.isGameActive = true;
    element.requestUpdate();
    await element.updateComplete;
    
    const button = element.shadowRoot.querySelector('custom-button');
    expect(button?.label).toBe('Stop!');
  });

  it('should activate the cell when risetto-shown is dispatched', async () => {
    await element.updateComplete;
    
    const event = new CustomEvent('risetto-shown', {
      detail: { cellIndex: 5 }
    });
    
    window.dispatchEvent(event);
    await element.updateComplete;
    
    expect(element._activeCells).toEqual([5]);
  });

  it('should clear active cells when risetto-hidden is dispatched', async () => {
    element._activeCells = [2, 4];
    await element.updateComplete;
    
    window.dispatchEvent(new CustomEvent('risetto-hidden'));
    await element.updateComplete;
    
    expect(element._activeCells).toEqual([]);
  });

  it('should update the score when mole-hit is dispatched', async () => {
    const updateScoreSpy = vi.spyOn(GameService, 'updateScore');
    await element.updateComplete;
    
    window.dispatchEvent(new CustomEvent('mole-hit'));
    
    expect(updateScoreSpy).toHaveBeenCalled();
  });
});
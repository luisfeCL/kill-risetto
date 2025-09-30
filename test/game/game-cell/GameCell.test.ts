import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import '../../../src/game/game-cell/GameCell';

describe('GameCell', () => {
  let element: any;

  beforeEach(() => {
    element = document.createElement('game-cell');
    document.body.appendChild(element);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    document.body.removeChild(element);
  });

  it('should render the component', async () => {
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  it('should render a div with class cell', async () => {
    await element.updateComplete;
    const cell = element.shadowRoot.querySelector('.cell');
    expect(cell).toBeTruthy();
  });

  it('should have role="button" on the cell div', async () => {
    await element.updateComplete;
    const cell = element.shadowRoot.querySelector('.cell');
    expect(cell?.getAttribute('role')).toBe('button');
  });

  it('should have cellIndex 0 by default', () => {
    expect(element.cellIndex).toBe(0);
  });

  it('should have active false by default', () => {
    expect(element.active).toBe(false);
  });

  it('should have clickEffect false by default', () => {
    expect(element.clickEffect).toBe(false);
  });

  it('should update cellIndex when it changes', async () => {
    element.cellIndex = 5;
    await element.updateComplete;
    
    expect(element.cellIndex).toBe(5);
  });

  it('should not show the mole when active is false', async () => {
    element.active = false;
    await element.updateComplete;
    
    const mole = element.shadowRoot.querySelector('.mole');
    expect(mole).toBeNull();
  });

  it('should show the mole when active is true', async () => {
    element.active = true;
    await element.updateComplete;
    
    const mole = element.shadowRoot.querySelector('.mole');
    expect(mole).toBeTruthy();
  });

  it('should show risetto image when active is true and clickEffect is false', async () => {
    element.active = true;
    element.clickEffect = false;
    await element.updateComplete;
    
    const img = element.shadowRoot.querySelector('.mole img');
    expect(img?.getAttribute('src')).toBe('/images/risetto_50x50.png');
  });

  it('should show angry risetto image when active is true and clickEffect is true', async () => {
    element.active = true;
    element.clickEffect = true;
    await element.updateComplete;
    
    const img = element.shadowRoot.querySelector('.mole img');
    expect(img?.getAttribute('src')).toBe('/images/risetto_angry_50x50.png');
  });

  it('should not dispatch mole-hit event when clicked and active is false', async () => {
    element.active = false;
    await element.updateComplete;
    
    const eventSpy = vi.fn();
    window.addEventListener('mole-hit', eventSpy);
    
    const cell = element.shadowRoot.querySelector('.cell');
    cell.click();
    
    expect(eventSpy).not.toHaveBeenCalled();
    
    window.removeEventListener('mole-hit', eventSpy);
  });

  it('should not change clickEffect when clicked and active is false', async () => {
    element.active = false;
    await element.updateComplete;
    
    const cell = element.shadowRoot.querySelector('.cell');
    cell.click();
    
    expect(element.clickEffect).toBe(false);
  });

  it('should dispatch mole-hit event when clicked and active is true', async () => {
    element.active = true;
    await element.updateComplete;
    
    const eventSpy = vi.fn();
    window.addEventListener('mole-hit', eventSpy);
    
    const cell = element.shadowRoot.querySelector('.cell');
    cell.click();
    
    expect(eventSpy).toHaveBeenCalled();
    
    window.removeEventListener('mole-hit', eventSpy);
  });

  it('should change clickEffect to true when clicked and active is true', async () => {
    element.active = true;
    await element.updateComplete;
    
    const cell = element.shadowRoot.querySelector('.cell');
    cell.click();
    
    expect(element.clickEffect).toBe(true);
  });

  it('should change from normal risetto to angry risetto when clicked', async () => {
    element.active = true;
    await element.updateComplete;
    
    let img = element.shadowRoot.querySelector('.mole img');
    expect(img?.getAttribute('src')).toBe('/images/risetto_50x50.png');
    
    const cell = element.shadowRoot.querySelector('.cell');
    cell.click();
    await element.updateComplete;
    
    img = element.shadowRoot.querySelector('.mole img');
    expect(img?.getAttribute('src')).toBe('/images/risetto_angry_50x50.png');
  });

  it('should revert clickEffect to false after 600ms', async () => {
    element.active = true;
    await element.updateComplete;
    
    const cell = element.shadowRoot.querySelector('.cell');
    cell.click();
    
    expect(element.clickEffect).toBe(true);
    
    vi.advanceTimersByTime(600);
    
    expect(element.clickEffect).toBe(false);
  });

  it('should revert to showing normal risetto after 600ms from the click', async () => {
    element.active = true;
    await element.updateComplete;
    
    const cell = element.shadowRoot.querySelector('.cell');
    cell.click();
    await element.updateComplete;
    
    let img = element.shadowRoot.querySelector('.mole img');
    expect(img?.getAttribute('src')).toBe('/images/risetto_angry_50x50.png');
    
    vi.advanceTimersByTime(600);
    await element.updateComplete;
    
    img = element.shadowRoot.querySelector('.mole img');
    expect(img?.getAttribute('src')).toBe('/images/risetto_50x50.png');
  });

  it('should dispatch event with bubbles=true and composed=true', async () => {
    element.active = true;
    await element.updateComplete;
    
    let capturedEvent: any = null;
    window.addEventListener('mole-hit', (e: any) => {
      capturedEvent = e;
    });
    
    const cell = element.shadowRoot.querySelector('.cell');
    cell.click();
    
    expect(capturedEvent.bubbles).toBe(true);
    expect(capturedEvent.composed).toBe(true);
    
    window.removeEventListener('mole-hit', () => {});
  });

  it('should handle multiple clicks correctly', async () => {
    element.active = true;
    await element.updateComplete;
    
    const eventSpy = vi.fn();
    window.addEventListener('mole-hit', eventSpy);
    
    const cell = element.shadowRoot.querySelector('.cell');
    
    cell.click();
    expect(eventSpy).toHaveBeenCalledTimes(1);
    
    vi.advanceTimersByTime(600);
    
    cell.click();
    expect(eventSpy).toHaveBeenCalledTimes(2);
    
    window.removeEventListener('mole-hit', eventSpy);
  });

  it('should not reset clickEffect prematurely if there are multiple clicks', async () => {
    element.active = true;
    await element.updateComplete;
    
    const cell = element.shadowRoot.querySelector('.cell');
    
    cell.click();
    expect(element.clickEffect).toBe(true);
    
    vi.advanceTimersByTime(300);
    expect(element.clickEffect).toBe(true);
    
    vi.advanceTimersByTime(300);
    expect(element.clickEffect).toBe(false);
  });
});
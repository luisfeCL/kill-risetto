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

  // render

  it('debería renderizar el componente', async () => {
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  it('debería renderizar un div con clase cell', async () => {
    await element.updateComplete;
    const cell = element.shadowRoot.querySelector('.cell');
    expect(cell).toBeTruthy();
  });

  it('debería tener role="button" en el div cell', async () => {
    await element.updateComplete;
    const cell = element.shadowRoot.querySelector('.cell');
    expect(cell?.getAttribute('role')).toBe('button');
  });

  // valores por defecto

  it('debería tener cellIndex 0 por defecto', () => {
    expect(element.cellIndex).toBe(0);
  });

  it('debería tener active false por defecto', () => {
    expect(element.active).toBe(false);
  });

  it('debería tener clickEffect false por defecto', () => {
    expect(element.clickEffect).toBe(false);
  });

  // cellIndex

  it('debería actualizar cellIndex cuando cambia', async () => {
    element.cellIndex = 5;
    await element.updateComplete;
    
    expect(element.cellIndex).toBe(5);
  });

  // estado active y renderizado del mole

  it('no debería mostrar el mole cuando active es false', async () => {
    element.active = false;
    await element.updateComplete;
    
    const mole = element.shadowRoot.querySelector('.mole');
    expect(mole).toBeNull();
  });

  it('debería mostrar el mole cuando active es true', async () => {
    element.active = true;
    await element.updateComplete;
    
    const mole = element.shadowRoot.querySelector('.mole');
    expect(mole).toBeTruthy();
  });

  it('debería mostrar imagen de risetto cuando active es true y clickEffect es false', async () => {
    element.active = true;
    element.clickEffect = false;
    await element.updateComplete;
    
    const img = element.shadowRoot.querySelector('.mole img');
    expect(img?.getAttribute('src')).toBe('/images/risetto_50x50.png');
  });

  it('debería mostrar imagen de risetto enfadado cuando active es true y clickEffect es true', async () => {
    element.active = true;
    element.clickEffect = true;
    await element.updateComplete;
    
    const img = element.shadowRoot.querySelector('.mole img');
    expect(img?.getAttribute('src')).toBe('/images/risetto_angry_50x50.png');
  });

  // click cuando no está activo

  it('no debería emitir evento mole-hit cuando se hace click y active es false', async () => {
    element.active = false;
    await element.updateComplete;
    
    const eventSpy = vi.fn();
    window.addEventListener('mole-hit', eventSpy);
    
    const cell = element.shadowRoot.querySelector('.cell');
    cell.click();
    
    expect(eventSpy).not.toHaveBeenCalled();
    
    window.removeEventListener('mole-hit', eventSpy);
  });

  it('no debería cambiar clickEffect cuando se hace click y active es false', async () => {
    element.active = false;
    await element.updateComplete;
    
    const cell = element.shadowRoot.querySelector('.cell');
    cell.click();
    
    expect(element.clickEffect).toBe(false);
  });

  // click cuando está activo

  it('debería emitir evento mole-hit cuando se hace click y active es true', async () => {
    element.active = true;
    await element.updateComplete;
    
    const eventSpy = vi.fn();
    window.addEventListener('mole-hit', eventSpy);
    
    const cell = element.shadowRoot.querySelector('.cell');
    cell.click();
    
    expect(eventSpy).toHaveBeenCalled();
    
    window.removeEventListener('mole-hit', eventSpy);
  });

  it('debería cambiar clickEffect a true cuando se hace click y active es true', async () => {
    element.active = true;
    await element.updateComplete;
    
    const cell = element.shadowRoot.querySelector('.cell');
    cell.click();
    
    expect(element.clickEffect).toBe(true);
  });

  it('debería cambiar de risetto normal a risetto angry cuando se hace click', async () => {
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

  it('debería volver clickEffect a false después de 600ms', async () => {
    element.active = true;
    await element.updateComplete;
    
    const cell = element.shadowRoot.querySelector('.cell');
    cell.click();
    
    expect(element.clickEffect).toBe(true);
    
    vi.advanceTimersByTime(600);
    
    expect(element.clickEffect).toBe(false);
  });

  it('debería volver a mostrar risetto normal después de 600ms del click', async () => {
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

  // propiedades del evento

  it('debería emitir evento con bubbles=true y composed=true', async () => {
    element.active = true;
    await element.updateComplete;
    
    let eventoCapturado: any = null;
    window.addEventListener('mole-hit', (e: any) => {
      eventoCapturado = e;
    });
    
    const cell = element.shadowRoot.querySelector('.cell');
    cell.click();
    
    expect(eventoCapturado.bubbles).toBe(true);
    expect(eventoCapturado.composed).toBe(true);
    
    window.removeEventListener('mole-hit', () => {});
  });

  // múltiples clicks

  it('debería manejar múltiples clicks correctamente', async () => {
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

  it('no debería resetear clickEffect antes de tiempo si hay múltiples clicks', async () => {
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
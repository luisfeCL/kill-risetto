import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../../../src/shared/components/input/CustomInput';

describe('CustomInput', () => {
  let element: any;

  beforeEach(() => {
    element = document.createElement('custom-input');
    document.body.appendChild(element);
  });

  it('debería renderizar el componente', async () => {
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  it('debería renderizar un input', async () => {
    await element.updateComplete;
    const input = element.shadowRoot.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('debería tener placeholder por defecto', () => {
    expect(element.placeholder).toBe('Your text!');
  });

  it('debería tener inputId por defecto', () => {
    expect(element.inputId).toBe('');
  });

  it('debería mostrar el placeholder por defecto', async () => {
    await element.updateComplete;
    const input = element.shadowRoot.querySelector('input');
    expect(input?.placeholder).toBe('Your text!');
  });

  it('debería actualizar el placeholder cuando cambia', async () => {
    element.placeholder = 'Nuevo placeholder';
    await element.updateComplete;
    
    const input = element.shadowRoot.querySelector('input');
    expect(input?.placeholder).toBe('Nuevo placeholder');
  });

  it('debería tener el id correcto en el input', async () => {
    element.inputId = 'mi-input-id';
    await element.updateComplete;
    
    const input = element.shadowRoot.querySelector('input');
    expect(input?.id).toBe('mi-input-id');
  });
  it('debería emitir evento onHasValue cuando el usuario escribe', async () => {
    await element.updateComplete;
    
    const eventSpy = vi.fn();
    element.addEventListener('onHasValue', eventSpy);
    
    const input = element.shadowRoot.querySelector('input');
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    
    expect(eventSpy).toHaveBeenCalled();
  });

  it('debería emitir el valor correcto en el evento onHasValue', async () => {
    await element.updateComplete;
    
    let value = '';
    element.addEventListener('onHasValue', (e: any) => {
      value = e.detail;
    });
    
    const input = element.shadowRoot.querySelector('input');
    input.value = 'Hola mundo';
    input.dispatchEvent(new Event('input'));
    
    expect(value).toBe('Hola mundo');
  });

  it('debería emitir evento con bubbles=true y composed=true', async () => {
    await element.updateComplete;
    
    let eventoCapturado: any = null;
    element.addEventListener('onHasValue', (e: any) => {
      eventoCapturado = e;
    });
    
    const input = element.shadowRoot.querySelector('input');
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    
    expect(eventoCapturado.bubbles).toBe(true);
    expect(eventoCapturado.composed).toBe(true);
  });

  
});
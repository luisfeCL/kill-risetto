import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../../../src/shared/components/input/CustomInput';

describe('CustomInput', () => {
  let element: any;

  beforeEach(() => {
    element = document.createElement('custom-input');
    document.body.appendChild(element);
  });

  it('should render the component', async () => {
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  it('should render an input', async () => {
    await element.updateComplete;
    const input = element.shadowRoot.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('should have a default placeholder', () => {
    expect(element.placeholder).toBe('Your text!');
  });

  it('should have a default inputId', () => {
    expect(element.inputId).toBe('');
  });

  it('should show the default placeholder', async () => {
    await element.updateComplete;
    const input = element.shadowRoot.querySelector('input');
    expect(input?.placeholder).toBe('Your text!');
  });

  it('should update the placeholder when it changes', async () => {
    element.placeholder = 'Nuevo placeholder';
    await element.updateComplete;
    
    const input = element.shadowRoot.querySelector('input');
    expect(input?.placeholder).toBe('Nuevo placeholder');
  });

  it('should have the correct id on the input', async () => {
    element.inputId = 'mi-input-id';
    await element.updateComplete;
    
    const input = element.shadowRoot.querySelector('input');
    expect(input?.id).toBe('mi-input-id');
  });
  it('should emit onHasValue event when the user types', async () => {
    await element.updateComplete;
    
    const eventSpy = vi.fn();
    element.addEventListener('onHasValue', eventSpy);
    
    const input = element.shadowRoot.querySelector('input');
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    
    expect(eventSpy).toHaveBeenCalled();
  });

  it('should emit the correct value in the onHasValue event', async () => {
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

  it('should emit event with bubbles=true and composed=true', async () => {
    await element.updateComplete;
    
    let capturedEvent: any = null;
    element.addEventListener('onHasValue', (e: any) => {
      capturedEvent = e;
    });
    
    const input = element.shadowRoot.querySelector('input');
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    
    expect(capturedEvent.bubbles).toBe(true);
    expect(capturedEvent.composed).toBe(true);
  });

  
});
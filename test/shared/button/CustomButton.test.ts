import { describe, it, expect, beforeEach } from 'vitest';
import '../../../src/shared/components/button/CustomButton';

describe('CustomButton', () => {
  let element: any;

  beforeEach(() => {
    element = document.createElement('custom-button');
    document.body.appendChild(element);
  });

  // render

  it('debería renderizar el componente', async () => {
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  it('debería renderizar un botón', async () => {
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('button');
    expect(button).toBeTruthy();
  });

  // valores por defecto

  it('debería tener label por defecto', () => {
    expect(element.label).toBe('Click me!');
  });

  it('debería NO estar deshabilitado por defecto', () => {
    expect(element.disabled).toBe(false);
  });

  it('debería NO ser rounded por defecto', () => {
    expect(element.rounded).toBe(false);
  });

  // label

  it('debería actualizar el label cuando cambia', async () => {
    element.label = 'Nuevo texto';
    await element.updateComplete;
    
    const button = element.shadowRoot.querySelector('button');
    expect(button?.textContent?.trim()).toBe('Nuevo texto');
  });

  // disabled

  it('debería estar deshabilitado cuando disabled=true', async () => {
    element.disabled = true;
    await element.updateComplete;
    
    const button = element.shadowRoot.querySelector('button');
    expect(button?.disabled).toBe(true);
  });

  it('debería habilitar el botón cuando disabled=false', async () => {
    element.disabled = true;
    await element.updateComplete;
    
    element.disabled = false;
    await element.updateComplete;
    
    const button = element.shadowRoot.querySelector('button');
    expect(button?.disabled).toBe(false);
  });

  // rounded prop

  it('debería NO tener clase rounded por defecto', async () => {
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('button');
    expect(button?.classList.contains('rounded')).toBe(false);
  });

  it('debería tener clase rounded cuando rounded=true', async () => {
    element.rounded = true;
    await element.updateComplete;
    
    const button = element.shadowRoot.querySelector('button');
    expect(button?.classList.contains('rounded')).toBe(true);
  });
});
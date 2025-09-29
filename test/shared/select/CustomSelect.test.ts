import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../../../src/shared/components/select/CustomSelect';

describe('CustomSelect', () => {
  let element: any;

  beforeEach(() => {
    element = document.createElement('custom-select');
    document.body.appendChild(element);
  });

  // render
  it('debería renderizar el componente', async () => {
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  it('debería renderizar un select', async () => {
    await element.updateComplete;
    const select = element.shadowRoot.querySelector('select');
    expect(select).toBeTruthy();
  });

  it('debería renderizar un label', async () => {
    await element.updateComplete;
    const label = element.shadowRoot.querySelector('label');
    expect(label).toBeTruthy();
  });

  it('debería renderizar un form', async () => {
    await element.updateComplete;
    const form = element.shadowRoot.querySelector('form');
    expect(form).toBeTruthy();
  });

  // valores por defecto

  it('debería tener value vacío por defecto', () => {
    expect(element.value).toBe('');
  });

  it('debería tener name vacío por defecto', () => {
    expect(element.name).toBe('');
  });

  it('debería tener id vacío por defecto', () => {
    expect(element.id).toBe('');
  });

  it('debería tener label por defecto', () => {
    expect(element.label).toBe('Select an option');
  });

  it('debería tener options vacío por defecto', () => {
    expect(element.options).toEqual([]);
  });

  // label
  it('debería mostrar el label por defecto', async () => {
    await element.updateComplete;
    const label = element.shadowRoot.querySelector('label');
    expect(label?.textContent).toBe('Select an option');
  });

  it('debería actualizar el label cuando cambia', async () => {
    element.label = 'Selecciona una opción';
    await element.updateComplete;
    
    const label = element.shadowRoot.querySelector('label');
    expect(label?.textContent).toBe('Selecciona una opción');
  });

  // name e id

  it('debería tener el name correcto en el select', async () => {
    element.name = 'mi-select';
    await element.updateComplete;
    
    const select = element.shadowRoot.querySelector('select');
    expect(select?.name).toBe('mi-select');
  });

  it('debería tener el id correcto en el select', async () => {
    element.id = 'mi-select-id';
    await element.updateComplete;
    
    const select = element.shadowRoot.querySelector('select');
    expect(select?.id).toBe('mi-select-id');
  });

  it('debería vincular el label con el select mediante el id', async () => {
    element.id = 'test-id';
    await element.updateComplete;
    
    const label = element.shadowRoot.querySelector('label');
    expect(label?.getAttribute('for')).toBe('test-id');
  });

  // options

  it('debería renderizar las opciones correctamente', async () => {
    element.options = [
      { value: '1', label: 'opción uno' },
      { value: '2', label: 'opción dos' },
      { value: '3', label: 'opción tres' }
    ];
    await element.updateComplete;
    
    const options = element.shadowRoot.querySelectorAll('option');
    expect(options.length).toBe(3);
  });

  it('debería capitalizar los labels de las opciones', async () => {
    element.options = [
      { value: '1', label: 'primera opción' },
      { value: '2', label: 'segunda opción' }
    ];
    await element.updateComplete;
    
    const options = element.shadowRoot.querySelectorAll('option');
    expect(options[0].textContent?.trim()).toBe('Primera opción');
    expect(options[1].textContent?.trim()).toBe('Segunda opción');
  });

  it('debería asignar los values correctos a las opciones', async () => {
    element.options = [
      { value: 'opt1', label: 'Opción 1' },
      { value: 'opt2', label: 'Opción 2' }
    ];
    await element.updateComplete;
    
    const options = element.shadowRoot.querySelectorAll('option');
    expect(options[0].value).toBe('opt1');
    expect(options[1].value).toBe('opt2');
  });

  // selected
  it('debería marcar como selected la opción que coincide con value', async () => {
    element.options = [
      { value: '1', label: 'Uno' },
      { value: '2', label: 'Dos' },
      { value: '3', label: 'Tres' }
    ];
    element.value = '2';
    await element.updateComplete;
    
    const options = element.shadowRoot.querySelectorAll('option');
    expect(options[0].selected).toBe(false);
    expect(options[1].selected).toBe(true);
    expect(options[2].selected).toBe(false);
  });

  it('debería actualizar el selected cuando cambia el value', async () => {
    element.options = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' }
    ];
    element.value = 'a';
    await element.updateComplete;
    
    let options = element.shadowRoot.querySelectorAll('option');
    expect(options[0].selected).toBe(true);
    
    element.value = 'b';
    await element.updateComplete;
    
    options = element.shadowRoot.querySelectorAll('option');
    expect(options[1].selected).toBe(true);
  });

  // evento value-selected

  it('debería emitir evento value-selected cuando cambia la selección', async () => {
    element.options = [
      { value: '1', label: 'Uno' },
      { value: '2', label: 'Dos' }
    ];
    await element.updateComplete;
    
    const eventSpy = vi.fn();
    element.addEventListener('value-selected', eventSpy);
    
    const select = element.shadowRoot.querySelector('select');
    select.value = '2';
    select.dispatchEvent(new Event('change'));
    
    expect(eventSpy).toHaveBeenCalled();
  });

  it('debería emitir el valor correcto en el evento value-selected', async () => {
    element.options = [
      { value: 'opt1', label: 'Opción 1' },
      { value: 'opt2', label: 'Opción 2' }
    ];
    await element.updateComplete;
    
    let detailValue = '';
    element.addEventListener('value-selected', (e: any) => {
      detailValue = e.detail.value;
    });
    
    const select = element.shadowRoot.querySelector('select');
    select.value = 'opt2';
    select.dispatchEvent(new Event('change'));
    
    expect(detailValue).toBe('opt2');
  });

  it('debería actualizar la propiedad value cuando cambia la selección', async () => {
    element.options = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' }
    ];
    await element.updateComplete;
    
    const select = element.shadowRoot.querySelector('select');
    select.value = 'b';
    select.dispatchEvent(new Event('change'));
    
    expect(element.value).toBe('b');
  });

  it('debería emitir evento con bubbles=true y composed=true', async () => {
    element.options = [{ value: '1', label: 'Uno' }];
    await element.updateComplete;
    
    let eventoCapturado: any = null;
    element.addEventListener('value-selected', (e: any) => {
      eventoCapturado = e;
    });
    
    const select = element.shadowRoot.querySelector('select');
    select.value = '1';
    select.dispatchEvent(new Event('change'));
    
    expect(eventoCapturado.bubbles).toBe(true);
    expect(eventoCapturado.composed).toBe(true);
  });

  it('debería incluir el value en el detail del evento', async () => {
    element.options = [{ value: 'test-value', label: 'Test' }];
    await element.updateComplete;
    
    let eventDetail: any = null;
    element.addEventListener('value-selected', (e: any) => {
      eventDetail = e.detail;
    });
    
    const select = element.shadowRoot.querySelector('select');
    select.value = 'test-value';
    select.dispatchEvent(new Event('change'));
    
    expect(eventDetail).toEqual({ value: 'test-value' });
  });
});
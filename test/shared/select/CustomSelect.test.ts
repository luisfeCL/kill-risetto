import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../../../src/shared/components/select/CustomSelect';

describe('CustomSelect', () => {
  let element: any;

  beforeEach(() => {
    element = document.createElement('custom-select');
    document.body.appendChild(element);
  });

  it('should render the component', async () => {
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  it('should render a select', async () => {
    await element.updateComplete;
    const select = element.shadowRoot.querySelector('select');
    expect(select).toBeTruthy();
  });

  it('should render a label', async () => {
    await element.updateComplete;
    const label = element.shadowRoot.querySelector('label');
    expect(label).toBeTruthy();
  });

  it('should render a form', async () => {
    await element.updateComplete;
    const form = element.shadowRoot.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('should have empty value by default', () => {
    expect(element.value).toBe('');
  });

  it('should have empty name by default', () => {
    expect(element.name).toBe('');
  });

  it('should have empty id by default', () => {
    expect(element.id).toBe('');
  });

  it('should have a default label', () => {
    expect(element.label).toBe('Select an option');
  });

  it('should have empty options by default', () => {
    expect(element.options).toEqual([]);
  });

  it('should display the default label', async () => {
    await element.updateComplete;
    const label = element.shadowRoot.querySelector('label');
    expect(label?.textContent).toBe('Select an option');
  });

  it('should update the label when it changes', async () => {
    element.label = 'Selecciona una opción';
    await element.updateComplete;
    
    const label = element.shadowRoot.querySelector('label');
    expect(label?.textContent).toBe('Selecciona una opción');
  });


  it('should have the correct name on the select', async () => {
    element.name = 'mi-select';
    await element.updateComplete;
    
    const select = element.shadowRoot.querySelector('select');
    expect(select?.name).toBe('mi-select');
  });

  it('should have the correct id on the select', async () => {
    element.id = 'mi-select-id';
    await element.updateComplete;
    
    const select = element.shadowRoot.querySelector('select');
    expect(select?.id).toBe('mi-select-id');
  });

  it('should link the label to the select using the id', async () => {
    element.id = 'test-id';
    await element.updateComplete;
    
    const label = element.shadowRoot.querySelector('label');
    expect(label?.getAttribute('for')).toBe('test-id');
  });


  it('should render the options correctly', async () => {
    element.options = [
      { value: '1', label: 'opción uno' },
      { value: '2', label: 'opción dos' },
      { value: '3', label: 'opción tres' }
    ];
    await element.updateComplete;
    
    const options = element.shadowRoot.querySelectorAll('option');
    expect(options.length).toBe(3);
  });

  it('should capitalize the option labels', async () => {
    element.options = [
      { value: '1', label: 'primera opción' },
      { value: '2', label: 'segunda opción' }
    ];
    await element.updateComplete;
    
    const options = element.shadowRoot.querySelectorAll('option');
    expect(options[0].textContent?.trim()).toBe('Primera opción');
    expect(options[1].textContent?.trim()).toBe('Segunda opción');
  });

  it('should assign the correct values to the options', async () => {
    element.options = [
      { value: 'opt1', label: 'Opción 1' },
      { value: 'opt2', label: 'Opción 2' }
    ];
    await element.updateComplete;
    
    const options = element.shadowRoot.querySelectorAll('option');
    expect(options[0].value).toBe('opt1');
    expect(options[1].value).toBe('opt2');
  });

  it('should mark as selected the option that matches the value', async () => {
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

  it('should update the selected option when the value changes', async () => {
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


  it('should emit value-selected event when the selection changes', async () => {
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

  it('should emit the correct value in the value-selected event', async () => {
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

  it('should update the value property when the selection changes', async () => {
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

  it('should emit event with bubbles=true and composed=true', async () => {
    element.options = [{ value: '1', label: 'Uno' }];
    await element.updateComplete;
    
    let capturedEvent: any = null;
    element.addEventListener('value-selected', (e: any) => {
      capturedEvent = e;
    });
    
    const select = element.shadowRoot.querySelector('select');
    select.value = '1';
    select.dispatchEvent(new Event('change'));
    
    expect(capturedEvent.bubbles).toBe(true);
    expect(capturedEvent.composed).toBe(true);
  });

  it('should include the value in the event detail', async () => {
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
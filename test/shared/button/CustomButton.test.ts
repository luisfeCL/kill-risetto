import { describe, it, expect, beforeEach } from 'vitest';
import '../../../src/shared/components/button/CustomButton';

describe('CustomButton', () => {
  let element: any;

  beforeEach(() => {
    element = document.createElement('custom-button');
    document.body.appendChild(element);
  });

  it('should render the component', async () => {
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  it('should render a button', async () => {
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should have a default label', () => {
    expect(element.label).toBe('Click me!');
  });

  it('should NOT be disabled by default', () => {
    expect(element.disabled).toBe(false);
  });

  it('should NOT be rounded by default', () => {
    expect(element.rounded).toBe(false);
  });

  it('should update the label when it changes', async () => {
    element.label = 'Nuevo texto';
    await element.updateComplete;
    
    const button = element.shadowRoot.querySelector('button');
    expect(button?.textContent?.trim()).toBe('Nuevo texto');
  });

  it('should be disabled when disabled=true', async () => {
    element.disabled = true;
    await element.updateComplete;
    
    const button = element.shadowRoot.querySelector('button');
    expect(button?.disabled).toBe(true);
  });

  it('should enable the button when disabled=false', async () => {
    element.disabled = true;
    await element.updateComplete;
    
    element.disabled = false;
    await element.updateComplete;
    
    const button = element.shadowRoot.querySelector('button');
    expect(button?.disabled).toBe(false);
  });

  it('should NOT have the rounded class by default', async () => {
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('button');
    expect(button?.classList.contains('rounded')).toBe(false);
  });

  it('should have the rounded class when rounded=true', async () => {
    element.rounded = true;
    await element.updateComplete;
    
    const button = element.shadowRoot.querySelector('button');
    expect(button?.classList.contains('rounded')).toBe(true);
  });
});
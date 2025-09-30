import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../../src/pages/home-page/home-page';
import UserService from '../../../src/services/user/user-data.service';
import { Router } from '@vaadin/router';

vi.mock('@vaadin/router', () => ({
  Router: {
    go: vi.fn()
  }
}));

describe('HomePage', () => {
  let element: any;

  beforeEach(() => {
    UserService.currentUser = null;
    vi.clearAllMocks();
    
    element = document.createElement('home-page');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should render the component', async () => {
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  it('should render the logo image', async () => {
    await element.updateComplete;
    const img = element.shadowRoot.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('/images/logo.png');
  });

  it('should render the custom-input', async () => {
    await element.updateComplete;
    const input = element.shadowRoot.querySelector('custom-input');
    expect(input).toBeTruthy();
  });

  it('should render the custom-button', async () => {
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('custom-button');
    expect(button).toBeTruthy();
  });

  it('should have disabled true by default', () => {
    expect(element.disabled).toBe(true);
  });

  it('should have _name undefined by default', () => {
    expect(element._name).toBeUndefined();
  });

  it('should have the button disabled by default', async () => {
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('custom-button');
    expect(button?.hasAttribute('disabled')).toBe(true);
  });

  it('should update _name on receiving input', () => {
    const event = new CustomEvent('onHasValue', {
      detail: 'TestUser'
    });
    
    element._handleInput(event);
    
    expect(element._name).toBe('TestUser');
  });

  it('should enable the button when there is text', async () => {
    const event = new CustomEvent('onHasValue', {
      detail: 'TestUser'
    });
    
    element._handleInput(event);
    await element.updateComplete;
    
    expect(element.disabled).toBe(false);
  });

  it('should disable the button when the text is empty', async () => {
    element._name = 'TestUser';
    element.disabled = false;
    await element.updateComplete;
    
    const event = new CustomEvent('onHasValue', {
      detail: ''
    });
    
    element._handleInput(event);
    await element.updateComplete;
    
    expect(element.disabled).toBe(true);
  });

  it('should create a user on click', () => {
    const createUserSpy = vi.spyOn(UserService, 'createUser');
    element._name = 'TestUser';
    
    element._handleClick();
    
    expect(createUserSpy).toHaveBeenCalledWith('TestUser');
  });

  it('should navigate to /game on click', () => {
    element._name = 'TestUser';
    element._handleClick();
    
    expect(Router.go).toHaveBeenCalledWith('/game');
  });

  it('should not create user if _name is undefined', () => {
    const createUserSpy = vi.spyOn(UserService, 'createUser');
    element._name = undefined;
    
    element._handleClick();
    
    expect(createUserSpy).not.toHaveBeenCalled();
  });

  it('should not navigate if _name is undefined', () => {
    element._name = undefined;
    
    element._handleClick();
    
    expect(Router.go).not.toHaveBeenCalled();
  });

  it('should listen for the onHasValue event', async () => {
    await element.updateComplete;
    
    const event = new CustomEvent('onHasValue', {
      detail: 'NewUser',
      bubbles: true,
      composed: true
    });
    
    element.dispatchEvent(event);
    
    expect(element._name).toBe('NewUser');
  });

  it('should add listeners on connect', () => {
    const addListenersSpy = vi.spyOn(element, '_addListeners');
    
    element.connectedCallback();
    
    expect(addListenersSpy).toHaveBeenCalled();
  });

  it('should remove listeners on disconnect', () => {
    const removeListenersSpy = vi.spyOn(element, '_removeListeners');
    
    element.disconnectedCallback();
    
    expect(removeListenersSpy).toHaveBeenCalled();
  });
});
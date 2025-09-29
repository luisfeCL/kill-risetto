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

  // render

  it('debería renderizar el componente', async () => {
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  it('debería renderizar la imagen del logo', async () => {
    await element.updateComplete;
    const img = element.shadowRoot.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('/images/logo.png');
  });

  it('debería renderizar el custom-input', async () => {
    await element.updateComplete;
    const input = element.shadowRoot.querySelector('custom-input');
    expect(input).toBeTruthy();
  });

  it('debería renderizar el custom-button', async () => {
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('custom-button');
    expect(button).toBeTruthy();
  });

  // valores por defecto

  it('debería tener disabled true por defecto', () => {
    expect(element.disabled).toBe(true);
  });

  it('debería tener _name undefined por defecto', () => {
    expect(element._name).toBeUndefined();
  });

  it('debería tener el botón deshabilitado por defecto', async () => {
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('custom-button');
    expect(button?.hasAttribute('disabled')).toBe(true);
  });

  // _handleInput

  it('debería actualizar _name al recibir input', () => {
    const event = new CustomEvent('onHasValue', {
      detail: 'TestUser'
    });
    
    element._handleInput(event);
    
    expect(element._name).toBe('TestUser');
  });

  it('debería habilitar el botón cuando hay texto', async () => {
    const event = new CustomEvent('onHasValue', {
      detail: 'TestUser'
    });
    
    element._handleInput(event);
    await element.updateComplete;
    
    expect(element.disabled).toBe(false);
  });

  it('debería deshabilitar el botón cuando el texto está vacío', async () => {
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

  // _handleClick

  it('debería crear un usuario al hacer click', () => {
    const createUserSpy = vi.spyOn(UserService, 'createUser');
    element._name = 'TestUser';
    
    element._handleClick();
    
    expect(createUserSpy).toHaveBeenCalledWith('TestUser');
  });

  it('debería navegar a game-page al hacer click', () => {
    element._name = 'TestUser';
    
    element._handleClick();
    
    expect(Router.go).toHaveBeenCalledWith('/game-page');
  });

  it('no debería crear usuario si _name es undefined', () => {
    const createUserSpy = vi.spyOn(UserService, 'createUser');
    element._name = undefined;
    
    element._handleClick();
    
    expect(createUserSpy).not.toHaveBeenCalled();
  });

  it('no debería navegar si _name es undefined', () => {
    element._name = undefined;
    
    element._handleClick();
    
    expect(Router.go).not.toHaveBeenCalled();
  });

  // eventos

  it('debería escuchar el evento onHasValue', async () => {
    await element.updateComplete;
    
    const event = new CustomEvent('onHasValue', {
      detail: 'NewUser',
      bubbles: true,
      composed: true
    });
    
    element.dispatchEvent(event);
    
    expect(element._name).toBe('NewUser');
  });

  // ciclo de vida

  it('debería agregar listeners al conectarse', () => {
    const addListenersSpy = vi.spyOn(element, '_addListeners');
    
    element.connectedCallback();
    
    expect(addListenersSpy).toHaveBeenCalled();
  });

  it('debería remover listeners al desconectarse', () => {
    const removeListenersSpy = vi.spyOn(element, '_removeListeners');
    
    element.disconnectedCallback();
    
    expect(removeListenersSpy).toHaveBeenCalled();
  });
});
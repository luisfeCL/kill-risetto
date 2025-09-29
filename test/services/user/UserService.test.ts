import { describe, it, expect, beforeEach, vi } from 'vitest';
import UserService from '../../../src/services/user/user-data.service';
import GameService from '../../../src/services/game/game.service';

vi.mock('../../../src/services/game/game.service', () => ({
  default: {
    currenDifficulty: 'easy'
  }
}));

describe('UserService', () => {
  beforeEach(() => {
    localStorage.clear();
    UserService.currentUser = null;
    vi.clearAllMocks();
  });

  // createUser

  it('debería crear un nuevo usuario si no existe', () => {
    UserService.createUser('TestUser');
    
    expect(UserService.currentUser).toBeTruthy();
    expect(UserService.currentUser?.displayName).toBe('TestUser');
    expect(UserService.currentUser?.name).toBe('testuser');
  });

  it('debería normalizar el nombre del usuario', () => {
    UserService.createUser('TestUser');
    
    expect(UserService.currentUser?.name).toBe('testuser');
  });

  it('debería establecer scores iniciales en 0', () => {
    UserService.createUser('TestUser');
    
    expect(UserService.currentUser?.scores).toEqual({
      easy: 0,
      medium: 0,
      hard: 0
    });
  });

  it('debería establecer lastDifficulty en easy por defecto', () => {
    UserService.createUser('TestUser');
    
    expect(UserService.currentUser?.lastDifficulty).toBe('easy');
  });

  it('debería devolver usuario existente si ya existe', () => {
    UserService.createUser('TestUser');
    const firstUser = UserService.currentUser;
    
    UserService.createUser('TestUser');
    const secondUser = UserService.currentUser;
    
    expect(firstUser?.name).toBe(secondUser?.name);
  });

  // getCurrentUser

  it('debería devolver el usuario actual', () => {
    UserService.createUser('TestUser');
    const user = UserService.getCurrentUser();
    
    expect(user?.displayName).toBe('TestUser');
  });

  it('debería devolver null si no hay usuario actual', () => {
    const user = UserService.getCurrentUser();
    
    expect(user).toBeNull();
  });

  // updateUserData

  it('debería actualizar el score si es mayor', () => {
    UserService.createUser('TestUser');
    UserService.updateUserData('easy', 100);
    
    expect(UserService.currentUser?.scores.easy).toBe(100);
  });

  it('debería actualizar lastDifficulty si cambia', () => {
    UserService.createUser('TestUser');
    UserService.updateUserData('medium');
    
    expect(UserService.currentUser?.lastDifficulty).toBe('medium');
  });

  it('no debería actualizar si no hay usuario actual', () => {
    UserService.updateUserData('easy', 100);
    
    expect(UserService.currentUser).toBeNull();
  });

  it('no debería actualizar si el score no es mayor', () => {
    UserService.createUser('TestUser');
    UserService.updateUserData('easy', 100);
    UserService.updateUserData('easy', 50);
    
    expect(UserService.currentUser?.scores.easy).toBe(100);
  });

  // getMaxScore

  it('debería devolver el score máximo para la dificultad actual', () => {
    GameService.currenDifficulty = 'easy';
    UserService.createUser('TestUser');
    UserService.updateUserData('easy', 100);
    
    const maxScore = UserService.getMaxScore();
    
    expect(maxScore).toBe(100);
  });

  it('debería devolver undefined si no hay usuario actual', () => {
    const maxScore = UserService.getMaxScore();
    
    expect(maxScore).toBeUndefined();
  });
});
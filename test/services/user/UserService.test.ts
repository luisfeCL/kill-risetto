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

  it('should create a new user if one doesn\'t exist', () => {
    UserService.createUser('TestUser');
    
    expect(UserService.currentUser).toBeTruthy();
    expect(UserService.currentUser?.displayName).toBe('TestUser');
    expect(UserService.currentUser?.name).toBe('testuser');
  });

  it('should normalize the username', () => {
    UserService.createUser('TestUser');
    
    expect(UserService.currentUser?.name).toBe('testuser');
  });

  it('should set initial scores to 0', () => {
    UserService.createUser('TestUser');
    
    expect(UserService.currentUser?.scores).toEqual({
      easy: 0,
      medium: 0,
      hard: 0
    });
  });

  it('should set lastDifficulty to easy by default', () => {
    UserService.createUser('TestUser');
    
    expect(UserService.currentUser?.lastDifficulty).toBe('easy');
  });

  it('should return existing user if already exists', () => {
    UserService.createUser('TestUser');
    const firstUser = UserService.currentUser;
    
    UserService.createUser('TestUser');
    const secondUser = UserService.currentUser;
    
    expect(firstUser?.name).toBe(secondUser?.name);
  });

  it('should return the current user', () => {
    UserService.createUser('TestUser');
    const user = UserService.getCurrentUser();
    
    expect(user?.displayName).toBe('TestUser');
  });

  it('should return null if there is no current user', () => {
    const user = UserService.getCurrentUser();
    
    expect(user).toBeNull();
  });

  it('should update the score if it is greater', () => {
    UserService.createUser('TestUser');
    UserService.updateUserData('easy', 100);
    
    expect(UserService.currentUser?.scores.easy).toBe(100);
  });

  it('should update lastDifficulty if it changes', () => {
    UserService.createUser('TestUser');
    UserService.updateUserData('medium');
    
    expect(UserService.currentUser?.lastDifficulty).toBe('medium');
  });

  it('should not update if there is no current user', () => {
    UserService.updateUserData('easy', 100);
    
    expect(UserService.currentUser).toBeNull();
  });

  it('should not update if the score is not greater', () => {
    UserService.createUser('TestUser');
    UserService.updateUserData('easy', 100);
    UserService.updateUserData('easy', 50);
    
    expect(UserService.currentUser?.scores.easy).toBe(100);
  });

  it('should return the maximum score for the current difficulty', () => {
    GameService.currenDifficulty = 'easy';
    UserService.createUser('TestUser');
    UserService.updateUserData('easy', 100);
    
    const maxScore = UserService.getMaxScore();
    
    expect(maxScore).toBe(100);
  });

  it('should return undefined if there is no current user', () => {
    const maxScore = UserService.getMaxScore();
    
    expect(maxScore).toBeUndefined();
  });
});
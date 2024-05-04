/* eslint-disable node/no-unpublished-import */
import {UserWithLevel} from '@sharedTypes/DBTypes';
import app from '../../src/app';

import {getFound, getNotFound} from './serverFunctions';
import {customize, getAllUsers} from './userTests';
import randomstring from 'randomstring';
import {Request, Response, NextFunction} from 'express';

const userpath = '/api/v1/users';
const customizePath = '/api/v1/users/customize';
const loginpath = '/api/v1/auth/login';

describe('GET /api/v1', () => {
  // test that server is running
  it('should return 200 OK', async () => {
    await getFound(app, '/');
  });

  // test that you get 404 Not Found
  it('should return 404 Not Found', async () => {
    await getNotFound(app, '/something');
  });

  // test user
  const testuser: Pick<UserWithLevel, 'username' | 'email' | 'password'> = {
    username: 'testuser' + randomstring.generate(5),
    email: randomstring.generate(5) + '@test.com',
    password: 'testpassword',
  };

  // test that you get all users
  it('should return all users', async () => {
    const users = await getAllUsers(app, userpath);
    expect(users.length).toBeGreaterThan(0);
  });
});

type MockData = {
  description: string;
  user_level_id: number;
  user_activity: string;
  pfp_url: string;
};
describe('PUT /api/v1', () => {
  it('should customize user', async () => {
    const mockData: MockData = {
      description: 'test description',
      user_level_id: 1,
      user_activity: 'active',
      pfp_url: 'https://example.com/avatar.png',
    };

    const response = await customize(mockData);

    // Check if the response matches the expected message
    expect(response.message).toEqual('user customized');
  });
});

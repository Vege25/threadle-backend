import {UserWithLevel} from '@sharedTypes/DBTypes';
import {MessageResponse} from '@sharedTypes/MessageTypes';

import {Express} from 'express';
import request from 'supertest';

const getAllUsers = (
  url: string | Express,
  path: string
): Promise<UserWithLevel[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get(path)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const users: UserWithLevel[] = response.body;
          users.forEach((user) => {
            expect(user).toHaveProperty('user_id');
            expect(user).toHaveProperty('username');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('created_at');
            expect(user).toHaveProperty('level_name');
          });
          resolve(users);
        }
      });
  });
};

type MockData = {
  description: string;
  user_level_id: number;
  user_activity: string;
  pfp_url: string;
};

const customize = (mockData: MockData): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    // Simulating the request processing using setTimeout
    setTimeout(() => {
      if (mockData.description === 'error') {
        reject(new Error('Simulated error'));
      } else {
        const response: MessageResponse = {message: 'user customized'};
        resolve(response);
      }
    }, 1000); // Simulating a delay of 1 second
  });
};

export {getAllUsers, customize};

import {UserWithLevel} from '@sharedTypes/DBTypes';

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
export {getAllUsers};

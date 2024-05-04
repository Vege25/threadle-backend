import {ChatMessages} from '@sharedTypes/DBTypes';
import request from 'supertest';

const chat_id = 1;

const getMessages = (mockData: ChatMessages[]): Promise<ChatMessages[]> => {
  return new Promise((resolve, reject) => {
    // Simulating the request processing using setTimeout
    setTimeout(() => {
      const chatMessages: ChatMessages[] = mockData;
      resolve(chatMessages);
    }, 1000); // Simulating a delay of 1 second
  });
};

export {getMessages};

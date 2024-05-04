/* eslint-disable @typescript-eslint/no-loss-of-precision */
import {ChatMessages} from '@sharedTypes/DBTypes';
import {getMessages} from './testChat';

// import app from '../src/app';
const app = 'http://localhost:3000';

describe('GET /api/v1', () => {
  // test api root
  // it('API root responds with a json message', async () => {
  //   await getApiRoot(app);
  // });

  // // test succesful category routes
  // let categories: ChatMessages[];
  // it('Should get array of categories', async () => {
  //   categories = await getCategories(app);
  // });
  // test chatMessages
  // it('Should get array of chatMessages', async () => {
  //   const chatMessages = await getMessages(app);
  //   expect(chatMessages.length).toBeGreaterThan(0);
  // });
  // Test getMessages function
  const mockChatMessages: ChatMessages[] = [
    {
      message_id: 1,
      chat_id: 1,
      sender_id: 123,
      receiver_id: 456,
      message: 'Message 1',
      created_at: new Date('2024-05-01'),
    },
    {
      message_id: 2,
      chat_id: 1,
      sender_id: 456,
      receiver_id: 123,
      message: 'Message 2',
      created_at: '2024-05-02T12:00:00',
    },
  ];
  it('should get chat messages', async () => {
    const chatMessages = await getMessages(mockChatMessages);

    chatMessages.forEach((chat) => {
      expect(chat.message_id).toBeGreaterThan(0);
      expect(chat.chat_id).toBeGreaterThan(0);
      expect(chat.sender_id).toBeGreaterThan(0);
      expect(chat.receiver_id).toBeGreaterThan(0);
      expect(chat.message).not.toBe('');
      expect(chat.created_at).not.toBe('');
    });
  });
});

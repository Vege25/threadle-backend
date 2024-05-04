import {ResultSetHeader, RowDataPacket} from 'mysql2';

import {ChatMessages, Chats} from '@sharedTypes/DBTypes';
import {ChatResponse, MessageResponse} from '@sharedTypes/MessageTypes';
import promisePool from '../../lib/db';

const getMessages = async (): Promise<ChatMessages[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & ChatMessages[]>(
      `
      SELECT c.chat_id, c.post_id, c.user_id, c.message_text, c.created_at
      FROM Chat c
      JOIN Users u ON c.user_id = u.user_id
      WHERE u.is_banned = false OR u.is_banned IS NULL;
  `
    );

    if (rows.length === 0) {
      return null;
    }

    return rows;
  } catch (e) {
    console.error('getMessages error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};
const getMyChatsById = async (id: number): Promise<ChatMessages[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & ChatMessages[]>(
      `
      SELECT c.chat_id, c.post_id, c.receiver_id, c.sender_id, c.created_at
      FROM Chat c
      WHERE c.receiver_id = ? OR c.sender_id = ?
  `,
      [id, id]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows;
  } catch (e) {
    console.error('getMyChatsById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};
const getMessagesByChatId = async (
  chat_id: number
): Promise<ChatMessages[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & ChatMessages[]>(
      `
      SELECT * FROM ChatMessages WHERE chat_id = ?;
  `,
      [chat_id]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows;
  } catch (e) {
    console.error('getMessagesByChatId error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};
const resetMessages = async (): Promise<MessageResponse | null> => {
  try {
    // Start a transaction
    await promisePool.execute('START TRANSACTION');

    // Insert new chat messages
    await promisePool.execute(
      `
      INSERT INTO Chat (user_id, message_text) VALUES
      ((SELECT user_id FROM Users WHERE username = 'JohnTheAdmin'), 'Hello and welcome to the Global Chat! Please be respectful to others. Enjoy!'),
      ((SELECT user_id FROM Users WHERE username = 'user1'), 'Hello this is user1 and I am new here. Nice to meet you all!'),
      ((SELECT user_id FROM Users WHERE username = 'user2'), 'You all stink! I am the best user here!'),
      ((SELECT user_id FROM Users WHERE username = 'JohnTheAdmin'), 'Hi user2! Please be respectful to others. I am the admin here and have the ability to ban unruly users.');
      `
    );

    // Commit the transaction
    await promisePool.execute('COMMIT');

    return {message: 'Chat messages reset'};
  } catch (e) {
    // Rollback the transaction if an error occurs
    await promisePool.execute('ROLLBACK');
    console.error('resetMessages error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const addChatMessage = async (
  chat_id: number,
  sender_id: number,
  receiver_id: number,
  message: string
): Promise<MessageResponse | null> => {
  try {
    const result = await promisePool.execute<ResultSetHeader>(
      `
    INSERT INTO ChatMessages (chat_id, sender_id, receiver_id, message) VALUES (?, ?, ?, ?);
  `,
      [chat_id, sender_id, receiver_id, message]
    );

    if (result[0].affectedRows === 0) {
      return null;
    }

    return {message: 'Chat message added to chat_id: ' + chat_id};
  } catch (e) {
    console.error('addChatMessage error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};
const getMyChats = async (id: number): Promise<Chats[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Chats[]>(
      `
      SELECT c.chat_id, c.post_id, c.receiver_id, c.sender_id, c.created_at
      FROM Chats c
      WHERE c.receiver_id = ? OR c.sender_id = ?;
  `,
      [id, id]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows;
  } catch (e) {
    console.error('getMyChats error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};
const getChatBySenderReceiver = async (
  sender_id: number,
  receiver_id: number
): Promise<ChatResponse | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & ChatResponse[]>(
      `
      SELECT c.chat_id, c.post_id, c.receiver_id, c.sender_id, c.created_at
      FROM Chats c
      WHERE c.receiver_id = ? AND c.sender_id = ? OR c.receiver_id = ? AND c.sender_id = ?;
  `,
      [receiver_id, sender_id, sender_id, receiver_id]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (e) {
    console.error('getChatBySenderReceiver error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};
const addChat = async (
  sender_id: number,
  receiver_id: number,
  post_id: number | null
): Promise<MessageResponse | null> => {
  let connection;
  try {
    connection = await promisePool.getConnection();

    await connection.beginTransaction();

    let chatId: number | null = null;

    if (post_id !== null) {
      // Insert into Chats with post_id
      const chatInsertQuery = `
        INSERT INTO Chats (sender_id, receiver_id, post_id)
        VALUES (?, ?, ?);
      `;
      const [chatInsertResult] = await connection.execute<ResultSetHeader>(
        chatInsertQuery,
        [sender_id, receiver_id, post_id]
      );
      chatId = chatInsertResult.insertId;
    } else {
      // Insert into Chats without post_id
      const chatInsertQuery = `
        INSERT INTO Chats (sender_id, receiver_id)
        VALUES (?, ?);
      `;
      const [chatInsertResult] = await connection.execute<ResultSetHeader>(
        chatInsertQuery,
        [sender_id, receiver_id]
      );
      chatId = chatInsertResult.insertId;
    }

    if (chatId === null) {
      await connection.rollback();
      return null;
    }

    // Insert into ChatMessages
    const chatMessageInsertQuery = `
      INSERT INTO ChatMessages (chat_id, sender_id, receiver_id, message)
      VALUES (?, ?, ?, ?);
    `;
    const chatMessageInsertResult = await connection.execute<ResultSetHeader>(
      chatMessageInsertQuery,
      [chatId, sender_id, receiver_id, 'Created this chat.']
    );

    if (chatMessageInsertResult[0].affectedRows === 0) {
      await connection.rollback();
      return null;
    }

    await connection.commit();

    return {
      message:
        'Chat conversation started by user_id: ' +
        sender_id +
        ' with user_id: ' +
        receiver_id +
        '. Message sent: ' +
        'Created this chat.',
    };
  } catch (e) {
    console.error('addChat error', (e as Error).message);
    if (connection) {
      await connection.rollback();
    }
    throw new Error((e as Error).message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const getChatByChatId = async (
  chat_id: number
): Promise<ChatResponse | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & ChatResponse[]>(
      `
      SELECT c.chat_id, c.post_id, c.receiver_id, c.sender_id, c.created_at
      FROM Chats c
      WHERE c.chat_id = ?;
  `,
      [chat_id]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (e) {
    console.error('getChatByChatId error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};
const getChatMessagesByChatId = async (
  chat_id: number
): Promise<ChatMessages[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & ChatMessages[]>(
      `
      SELECT * FROM ChatMessages WHERE chat_id = ? ORDER BY created_at ASC;
  `,
      [chat_id]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows;
  } catch (e) {
    console.error('getChatMessagesByChatId error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};
export {
  getMessagesByChatId,
  getMyChatsById,
  getMessages,
  resetMessages,
  addChat,
  getMyChats,
  getChatBySenderReceiver,
  addChatMessage,
  getChatByChatId,
  getChatMessagesByChatId,
};

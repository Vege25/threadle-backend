import {RowDataPacket} from 'mysql2';
import promisePool from '../../lib/db';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const fetchAllNotifications = async (
  user_id: number
): Promise<Notification[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Notification[]>(
      'SELECT * FROM Notifications WHERE user_id = ?;',
      [user_id]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllNotifications error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const postNotification = async (
  user_id: number,
  message: string
): Promise<MessageResponse | null> => {
  try {
    const [result] = await promisePool.execute<
      [RowDataPacket[], RowDataPacket[]]
    >(
      `
      INSERT INTO Notifications (user_id, message) VALUES (?, ?);
      `,
      [user_id, message]
    );

    if (
      result.length > 0 &&
      'affectedRows' in result[0] &&
      result[0].affectedRows === 0
    ) {
      return null;
    }

    return {message: 'Notification added'};
  } catch (e) {
    console.error('postNotification error', e);
    throw new Error((e as Error).message);
  }
};

const notificationPut = async (
  user_id: number,
  notification_id: number
): Promise<MessageResponse | null> => {
  try {
    const [result] = await promisePool.execute<
      [RowDataPacket[], RowDataPacket[]]
    >(
      `
      UPDATE Notifications SET viewed = 1 WHERE user_id = ? AND notification_id = ?;
      `,
      [user_id, notification_id]
    );

    if (
      result.length > 0 &&
      'affectedRows' in result[0] &&
      result[0].affectedRows === 0
    ) {
      return null;
    }

    return {message: 'Notification viewed updated'};
  } catch (e) {
    console.error('notificationPut error', e);
    throw new Error((e as Error).message);
  }
};
export {postNotification, fetchAllNotifications, notificationPut};

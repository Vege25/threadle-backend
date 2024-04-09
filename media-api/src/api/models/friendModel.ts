import {UserWithNoPassword} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {UserDeleteResponse} from '@sharedTypes/MessageTypes';
import {fetchData} from '../../lib/functions';

const deleteFriendship = async (
  userFromToken: number,
  id: number
): Promise<UserDeleteResponse | null> => {
  try {
    const [result] = await promisePool.execute<
      [RowDataPacket[], RowDataPacket[]]
    >(
      `
      DELETE FROM Friends
      WHERE
      (sender_id = ? AND receiver_id = ?)
      OR
      (sender_id = ? AND receiver_id = ?);
      `,
      [userFromToken, id, id, userFromToken]
    );

    // Check if the query was successful (OkPacket) and affectedRows is greater than 0
    if (
      result.length > 0 &&
      'affectedRows' in result[0] &&
      result[0].affectedRows === 0
    ) {
      return null;
    }

    console.log('result', result);
    return {message: 'Friendship removed', user: {user_id: id}};
  } catch (e) {
    console.error('deleteFriendship error', e);
    throw new Error((e as Error).message);
  }
};
const addFriendship = async (
  userFromToken: number,
  id: number
): Promise<UserDeleteResponse | null> => {
  try {
    const [result] = await promisePool.execute<
      [RowDataPacket[], RowDataPacket[]]
    >(
      `
      INSERT INTO Friends (sender_id, receiver_id) VALUES (?, ?);
      `,
      [userFromToken, id]
    );

    // Check if the query was successful (OkPacket) and affectedRows is greater than 0
    if (
      result.length > 0 &&
      'affectedRows' in result[0] &&
      result[0].affectedRows === 0
    ) {
      return null;
    }

    console.log('result', result);
    return {message: 'Friendship added', user: {user_id: id}};
  } catch (e) {
    console.error('addFriendship error', e);
    throw new Error((e as Error).message);
  }
};

const getFriendsById = async (
  id: number
): Promise<UserWithNoPassword[] | null> => {
  try {
    const [rows] = await promisePool.execute<
      RowDataPacket[] & UserWithNoPassword[]
    >(
      `
      SELECT
        u.user_id,
        u.username,
        u.email
      FROM
        Users u
      JOIN
        Friends f ON (u.user_id = f.sender_id OR u.user_id = f.receiver_id)
      WHERE
        (f.sender_id = ? OR f.receiver_id = ?)
        AND f.status = 'accepted'
        AND u.user_id != ?
      ORDER BY
        f.created_at DESC;
      `,
      [id, id, id]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows;
  } catch (e) {
    console.error('getFriendsById error', e);
    throw new Error((e as Error).message);
  }
};
const getPendingFriendsById = async (
  id: number
): Promise<UserWithNoPassword[] | null> => {
  try {
    const [rows] = await promisePool.execute<
      RowDataPacket[] & UserWithNoPassword[]
    >(
      `
      SELECT u.user_id, u.username, u.email FROM Users u
JOIN Friends f ON (u.user_id = f.sender_id OR u.user_id = f.receiver_id)
WHERE f.receiver_id = ?
AND f.status = 'pending'
AND u.user_id != ?
ORDER BY f.created_at DESC;

      `,
      [id, id]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows;
  } catch (e) {
    console.error('getFriendsById error', e);
    throw new Error((e as Error).message);
  }
};
const acceptFriendRequest = async (
  id: number,
  userFromToken: number
): Promise<UserWithNoPassword | null> => {
  try {
    const sql = promisePool.format(
      `
      UPDATE Friends SET Friends.status = "accepted" WHERE Friends.sender_id = ? AND Friends.receiver_id = ?;
      `,
      [id, userFromToken]
    );

    const result = await promisePool.execute<ResultSetHeader>(sql);
    console.log('acceptFriendRequest', result[0]);

    if (result[0].affectedRows === 0) {
      return null;
    }

    // const newUser = await getUserById(id);
    const newUser = await fetchData<UserWithNoPassword>(
      process.env.AUTH_SERVER + '/users/' + id
    );

    return newUser;
  } catch (e) {
    console.error('acceptFriendRequest error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {
  deleteFriendship,
  addFriendship,
  getFriendsById,
  getPendingFriendsById,
  acceptFriendRequest,
};

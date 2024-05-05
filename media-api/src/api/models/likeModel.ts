import {ResultSetHeader, RowDataPacket} from 'mysql2';
import promisePool from '../../lib/db';
import {Like, Save} from '@sharedTypes/DBTypes';

const postLike = async (post_id: number, user_id: number) => {
  try {
    console.log('postLike', post_id, user_id);
    // Check if a like already exists for the given post_id and user_id
    const [existingLike] = await promisePool.execute(
      'SELECT save_id FROM Saves WHERE post_id = ? AND user_id = ?;',
      [post_id, user_id]
    );

    if ((existingLike as any[]).length > 0) {
      return {message: 'Like already exists'};
    }

    const [result] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO Saves (post_id, user_id) VALUES (?, ?)',
      [post_id, user_id]
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return {message: 'Like added'};
  } catch (e) {
    console.error('postLike error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const getUserLike = async (
  post_id: number,
  user_id: number
): Promise<Save | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Like>(
      'SELECT * FROM Saves WHERE post_id = ? AND user_id = ?;',
      [post_id, user_id]
    );
    if (rows.length === 0) {
      return null;
    }
    const like: Save = rows[0] as Save;
    return like;
  } catch (e) {
    console.error('getUserLike error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const getCountByMediaId = async (post_id: number): Promise<{count: number}> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM Saves WHERE post_id = ?;',
      [post_id]
    );
    if (rows.length === 0) {
      return {count: 0};
    }
    return rows[0] as {count: number};
  } catch (e) {
    console.error('getCountByMediaId error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const deleteLike = async (post_id: number, user_id: number) => {
  try {
    const [result] = await promisePool.execute<ResultSetHeader>(
      'DELETE FROM Saves WHERE post_id = ? AND user_id = ?;',
      [post_id, user_id]
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return {message: 'Like deleted'};
  } catch (e) {
    console.error('deleteLike error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const getUserSaves = async (user_id: number): Promise<Save[]> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[]>(
      'SELECT * FROM Saves WHERE user_id = ? ORDER BY created_at DESC;',
      [user_id]
    );

    // Map the rows from RowDataPacket[] to Save[]
    const likes: Save[] = rows.map((row: RowDataPacket) => {
      return {
        save_id: row.save_id,
        post_id: row.post_id,
        user_id: row.user_id,
        created_at: row.created_at,
      };
    });

    return likes;
  } catch (e) {
    console.error('getUserSaves error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {postLike, getUserLike, getCountByMediaId, deleteLike, getUserSaves};

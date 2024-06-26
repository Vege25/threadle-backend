import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {PostItem, TokenContent} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {fetchData} from '../../lib/functions';
import {MessageResponse} from '@sharedTypes/MessageTypes';

/**
 * Get all media items from the database
 *
 * @returns {array} - array of media items
 * @throws {Error} - error if database query fails
 */

const fetchAllMedia = async (): Promise<PostItem[] | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & PostItem[]>(
      `SELECT *,
      CONCAT(?, filename) AS filename,
      CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
      FROM Posts`,
      [uploadPath, uploadPath]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllMedia error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const fetchAllMediaByUserId = async (
  user_id: number
): Promise<PostItem[] | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & PostItem[]>(
      `SELECT *,
      CONCAT(?, filename) AS filename,
      CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
      FROM Posts WHERE user_id = ? ORDER BY created_at DESC;`,
      [uploadPath, uploadPath, user_id]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllMediaByUserId error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get media item by id from the database
 *
 * @param {number} id - id of the media item
 * @returns {object} - object containing all information about the media item
 * @throws {Error} - error if database query fails
 */

const fetchMediaById = async (id: number): Promise<PostItem | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    // TODO: replace * with specific column names needed in this case
    const sql = `SELECT *,
                CONCAT(?, filename) AS filename,
                CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
                FROM Posts
                WHERE post_id=?`;
    const params = [uploadPath, uploadPath, id];
    const [rows] = await promisePool.execute<RowDataPacket[] & PostItem[]>(
      sql,
      params
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('fetchMediaById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};
const fetchHighlightMediaById = async (
  user_id: number
): Promise<PostItem | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    // TODO: replace * with specific column names needed in this case
    const sql = `SELECT *,
                CONCAT(?, filename) AS filename,
                CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
                FROM Posts
                WHERE user_id=? AND highlight = 1`;
    const params = [uploadPath, uploadPath, user_id];
    const [rows] = await promisePool.execute<RowDataPacket[] & PostItem[]>(
      sql,
      params
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('fetchHighlightMediaById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Add new media item to database
 *
 * @param {object} media - object containing all information about the new media item
 * @returns {object} - object containing id of the inserted media item in db
 * @throws {Error} - error if database query fails
 */
const postMedia = async (
  media: Omit<PostItem, 'post_id' | 'created_at'>
): Promise<PostItem | null> => {
  const {user_id, filename, filesize, media_type, title, description} = media;
  const sql = `INSERT INTO Posts (user_id, filename, filesize, media_type, title, description, highlight)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    user_id,
    filename,
    filesize,
    media_type,
    title,
    description,
    false,
  ];
  try {
    const result = await promisePool.execute<ResultSetHeader>(sql, params);
    console.log('result', result);
    const [rows] = await promisePool.execute<RowDataPacket[] & PostItem[]>(
      'SELECT * FROM Posts WHERE post_id = ?',
      [result[0].insertId]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Update media item in database
 *
 * @param {object} media - object containing all information about the media item
 * @param {number} id - id of the media item
 * @returns {object} - object containing id of the updated media item in db
 * @throws {Error} - error if database query fails
 */

const putMedia = async (
  media: Pick<PostItem, 'title' | 'description'>,
  id: number
) => {
  try {
    const sql = promisePool.format('UPDATE Posts SET ? WHERE ?', [media, id]);
    const result = await promisePool.execute<ResultSetHeader>(sql);
    console.log('result', result);
    return {post_id: result[0].insertId};
  } catch (e) {
    console.error('error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Delete media item from database
 *
 * @param {number} id - id of the media item
 * @returns {object} - object containing id of the deleted media item in db
 * @throws {Error} - error if database query fails
 */

const deleteMedia = async (
  id: number,
  user: TokenContent,
  token: string
): Promise<MessageResponse> => {
  console.log('deleteMedia', id);
  const media = await fetchMediaById(id);
  console.log(media);

  if (!media) {
    return {message: 'Media not found'};
  }

  // if admin add user_id from media object to user object from token content
  if (user.level_name === 'Admin') {
    user.user_id = media.user_id;
  }

  // remove environment variable UPLOAD_URL from filename
  media.filename = media?.filename.replace(
    process.env.UPLOAD_URL as string,
    ''
  );

  console.log(token);

  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute('DELETE FROM Saves WHERE post_id = ?;', [id]);

    await connection.execute('DELETE FROM Comments WHERE post_id = ?;', [id]);

    await connection.execute('DELETE FROM Ratings WHERE post_id = ?;', [id]);

    // ! user_id in SQL so that only the owner of the media item can delete it
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Posts WHERE post_id = ? and user_id = ?;',
      [id, user.user_id]
    );

    if (result.affectedRows === 0) {
      return {message: 'Media not deleted'};
    }

    // delete file from upload server
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    const deleteResult = await fetchData<MessageResponse>(
      `${process.env.UPLOAD_SERVER}/delete/${media.filename}`,
      options
    );

    console.log('deleteResult', deleteResult);
    if (deleteResult.message !== 'File deleted') {
      throw new Error('File not deleted');
    }

    // if no errors commit transaction
    await connection.commit();

    return {message: 'Media deleted'};
  } catch (e) {
    await connection.rollback();
    console.error('error', (e as Error).message);
    throw new Error((e as Error).message);
  } finally {
    connection.release();
  }
};

const highlightMediaPut = async (
  post_id: number,
  user_id: number
): Promise<MessageResponse> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      'UPDATE Posts SET highlight = 0 WHERE user_id = ?',
      [user_id]
    );
    await connection.execute(
      'UPDATE Posts SET highlight = 1 WHERE post_id = ? AND user_id = ?',
      [post_id, user_id]
    );
    await connection.commit();
    return {message: 'Media highlighted'};
  } catch (error) {
    await connection.rollback();
    console.error('highlightMediaPut error:', error);
    throw new Error((error as Error).message);
  } finally {
    connection.release();
  }
};

export {
  fetchAllMedia,
  fetchMediaById,
  postMedia,
  deleteMedia,
  putMedia,
  fetchAllMediaByUserId,
  fetchHighlightMediaById,
  highlightMediaPut,
};

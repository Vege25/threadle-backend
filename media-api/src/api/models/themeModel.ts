import {ResultSetHeader, RowDataPacket} from 'mysql2';
import promisePool from '../../lib/db';
import {Comment, Theme, UserLevel} from '@sharedTypes/DBTypes';
import {MessageResponse} from '@sharedTypes/MessageTypes';
import CustomError from '../../classes/CustomError';

// Request a list of themes
const fetchAllThemes = async (): Promise<Theme[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Theme[]>(
      'SELECT * FROM Themes;'
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllThemes error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Request a list of themes by user id
// Request a list of themes by user id
const fetchThemeByUserId = async (id: number): Promise<Theme | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Theme[]>(
      'SELECT * FROM Themes WHERE user_id = ?;',
      [id]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('fetchThemeByUserId error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Create or update a theme
const postTheme = async (
  user_id: number,
  color1: string,
  color2: string | null,
  color3: string | null,
  color4: string | null,
  font1: string | null,
  font2: string | null
): Promise<MessageResponse> => {
  let connection;

  try {
    connection = await promisePool.getConnection();
    await connection.beginTransaction(); // Begin transaction

    const existingTheme = await fetchThemeByUserId(user_id);
    if (existingTheme) {
      // Delete the old theme
      const deleteSql = 'DELETE FROM Themes WHERE user_id = ?';
      await connection.execute(deleteSql, [user_id]);
    }

    // Insert the new theme
    const insertSql = promisePool.format(
      'INSERT INTO Themes (user_id, color1, color2, color3, color4, font1, font2) VALUES (?, ?, ?, ?, ?, ?, ?);',
      [user_id, color1, color2, color3, color4, font1, font2]
    );
    await connection.execute<ResultSetHeader>(insertSql);

    await connection.commit();
    return {message: 'Theme added/updated for user_id: ' + user_id};
  } catch (error) {
    if (connection) {
      await connection.rollback(); // Rollback transaction on error
    }
    console.error('postTheme error:', error);
    throw new CustomError('Failed to create/update theme', 500);
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
};
export {fetchAllThemes, fetchThemeByUserId, postTheme};

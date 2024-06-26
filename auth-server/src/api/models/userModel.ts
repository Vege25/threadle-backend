import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {promisePool} from '../../lib/db';
import {UserWithLevel, User, UserWithNoPassword} from '@sharedTypes/DBTypes';
import {MessageResponse, UserDeleteResponse} from '@sharedTypes/MessageTypes';

const getUserById = async (id: number): Promise<UserWithNoPassword | null> => {
  try {
    const [rows] = await promisePool.execute<
      RowDataPacket[] & UserWithNoPassword[]
    >(
      `
    SELECT
      Users.user_id,
      Users.username,
      Users.email,
      Users.created_at,
      Users.description,
      Users.user_activity,
      UserLevels.level_name,
      Users.pfp_url
    FROM Users
    JOIN UserLevels
    ON Users.user_level_id = UserLevels.level_id
    WHERE Users.user_id = ?
  `,
      [id]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('getUserById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const getAllUsers = async (): Promise<UserWithNoPassword[] | null> => {
  try {
    const [rows] = await promisePool.execute<
      RowDataPacket[] & UserWithNoPassword[]
    >(
      `
    SELECT
      Users.user_id,
      Users.username,
      Users.email,
      Users.description,
      Users.created_at,
      Users.user_activity,
      UserLevels.level_name,
      Users.pfp_url
    FROM Users
    JOIN UserLevels
    ON Users.user_level_id = UserLevels.level_id
  `
    );

    if (rows.length === 0) {
      return null;
    }

    return rows;
  } catch (e) {
    console.error('getAllUsers error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const getUserByEmail = async (email: string): Promise<UserWithLevel | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & UserWithLevel[]>(
      `
    SELECT
      Users.user_id,
      Users.username,
      Users.password,
      Users.email,
      Users.description,
      Users.created_at,
      Users.user_activity,
      UserLevels.level_name,
      Users.pfp_url
    FROM Users
    JOIN UserLevels
    ON Users.user_level_id = UserLevels.level_id
    WHERE Users.email = ?
  `,
      [email]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('getUserByEmail error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const getUserByUsername = async (
  username: string
): Promise<UserWithLevel | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & UserWithLevel[]>(
      `
    SELECT
      Users.user_id,
      Users.username,
      Users.password,
      Users.email,
      Users.description,
      Users.created_at,
      Users.user_activity,
      UserLevels.level_name,
      Users.pfp_url
    FROM Users
    JOIN UserLevels
    ON Users.user_level_id = UserLevels.level_id
    WHERE Users.username = ?
  `,
      [username]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('getUserByUsername error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const createUser = async (user: User): Promise<UserWithNoPassword | null> => {
  try {
    console.log('here');
    const result = await promisePool.execute<ResultSetHeader>(
      `
    INSERT INTO Users (username, password, email, user_level_id, user_activity, Description)
    VALUES (?, ?, ?, ?, ?, ?);
  `,
      [
        user.username,
        user.password,
        user.email,
        user.user_level_id === 3 ? 3 : 2,
        'Active',
        user.description ? user.description : null,
      ]
    );
    console.log('result', result);

    if (result[0].affectedRows === 0) {
      return null;
    }
    console.log('here', result[0].insertId);

    const newUser = await getUserById(result[0].insertId);
    console.log('newUser', newUser);
    return newUser;
  } catch (e) {
    console.error('createUser error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const modifyUser = async (
  user: User,
  id: number
): Promise<UserWithNoPassword | null> => {
  try {
    const sql = promisePool.format(
      `
      UPDATE Users
      SET ?
      WHERE user_id = ?
      `,
      [user, id]
    );

    const result = await promisePool.execute<ResultSetHeader>(sql);

    if (result[0].affectedRows === 0) {
      return null;
    }

    const newUser = await getUserById(id);
    return newUser;
  } catch (e) {
    console.error('modifyUser error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};
const customizeUser = async (
  description: string | null,
  user_activity: string | null,
  user_level_id: number | null,
  user_id: number,
  pfp_url: string | null
): Promise<MessageResponse | null> => {
  try {
    let sql = `
      UPDATE Users
      SET user_activity = ?, user_level_id = ?
    `;
    let params: (string | number)[] = [
      user_activity || 'active',
      user_level_id || 2,
    ];

    // Add description and pfp_url to the query only if they are provided
    if (description !== null) {
      sql += ', description = ?';
      params.push(description);
    }
    if (pfp_url !== null) {
      sql += ', pfp_url = ?';
      params.push(pfp_url);
    }

    sql += ' WHERE user_id = ?';
    params.push(user_id);

    const result = await promisePool.execute<ResultSetHeader>(sql, params);

    if (result[0].affectedRows === 0) {
      return null;
    }

    return {message: 'user customized'};
  } catch (e) {
    console.error('customizeUser error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const deleteUser = async (id: number): Promise<UserDeleteResponse | null> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('DELETE FROM Comments WHERE user_id = ?;', [id]);
    await connection.execute('DELETE FROM Saves WHERE user_id = ?;', [id]);
    await connection.execute('DELETE FROM Ratings WHERE user_id = ?;', [id]);
    await connection.execute(
      'DELETE FROM Comments WHERE post_id IN (SELECT post_id FROM Posts WHERE user_id = ?);',
      [id]
    );
    await connection.execute(
      'DELETE FROM Saves WHERE post_id IN (SELECT post_id FROM Posts WHERE user_id = ?);',
      [id]
    );
    await connection.execute(
      'DELETE FROM Ratings WHERE post_id IN (SELECT post_id FROM Posts WHERE user_id = ?);',
      [id]
    );
    await connection.execute(
      'DELETE FROM PostsTags WHERE post_id IN (SELECT post_id FROM Posts WHERE user_id = ?);',
      [id]
    );
    await connection.execute('DELETE FROM Posts WHERE user_id = ?;', [id]);
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Users WHERE user_id = ?;',
      [id]
    );

    await connection.commit();

    if (result.affectedRows === 0) {
      return null;
    }

    console.log('result', result);
    return {message: 'User deleted', user: {user_id: id}};
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
};

export {
  getUserById,
  getAllUsers,
  getUserByEmail,
  getUserByUsername,
  createUser,
  modifyUser,
  customizeUser,
  deleteUser,
};

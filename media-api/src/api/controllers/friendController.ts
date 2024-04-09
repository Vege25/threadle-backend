import {TokenContent, UserWithNoPassword} from '@sharedTypes/DBTypes';
import {NextFunction, Request, Response} from 'express';
import {validationResult} from 'express-validator';
import CustomError from '../../classes/CustomError';
import {UserDeleteResponse, UserResponse} from '@sharedTypes/MessageTypes';
import {
  acceptFriendRequest,
  addFriendship,
  deleteFriendship,
  getFriendsById,
  getPendingFriendsById,
} from '../models/friendModel';

const friendsGet = async (
  req: Request,
  res: Response<UserWithNoPassword[]>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('friendsGet validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const userFromToken = res.locals.user;
    const friends = await getFriendsById(parseInt(userFromToken.user_id));
    if (friends === null) {
      next(new CustomError('Friends not found', 404));
      return;
    }
    res.json(friends);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const friendRequest = async (
  req: Request,
  res: Response<UserDeleteResponse, {user: TokenContent}>,
  next: NextFunction
) => {
  try {
    const userFromToken = res.locals.user;

    const result = await addFriendship(
      userFromToken.user_id,
      parseInt(req.params.id)
    );

    if (!result) {
      next(new CustomError('Friend not found', 404));
      return;
    }
    console.log(result);
    res.json(result);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const pendingFriendsGet = async (
  req: Request,
  res: Response<UserWithNoPassword[]>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('pendingFriendsGet validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const userFromToken = res.locals.user;
    const friends = await getPendingFriendsById(
      parseInt(userFromToken.user_id)
    );
    if (friends === null) {
      next(new CustomError('Pending Friends not found', 404));
      return;
    }
    console.log(friends);
    res.json(friends);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const friendAcceptPut = async (
  req: Request<{id: string}>,
  res: Response<UserResponse, {user: TokenContent}>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const userFromToken = res.locals.user;

    const result = await acceptFriendRequest(
      parseInt(req.params.id),
      userFromToken.user_id
    );

    if (!result) {
      next(new CustomError('Friend request not found', 404));
      return;
    }

    console.log('put result', result);

    const response: UserResponse = {
      message: 'Friend request accepted',
      user: result,
    };
    res.json(response);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};
const friendDelete = async (
  req: Request,
  res: Response<UserDeleteResponse, {user: TokenContent}>,
  next: NextFunction
) => {
  try {
    const userFromToken = res.locals.user;
    console.log('user from token', userFromToken);

    const result = await deleteFriendship(
      userFromToken.user_id,
      parseInt(req.params.id)
    );

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    res.json(result);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {
  friendsGet,
  pendingFriendsGet,
  friendRequest,
  friendAcceptPut,
  friendDelete,
};

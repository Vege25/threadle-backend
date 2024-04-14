import {Request, Response, NextFunction} from 'express';
import {
  postLike,
  getUserLike,
  getCountByMediaId,
  deleteLike,
} from '../models/likeModel';
import CustomError from '../../classes/CustomError';

const likePost = async (
  req: Request<{post_id: string}>,
  res: Response<{message: string}>,
  next: NextFunction
) => {
  try {
    const post_id = Number(req.params.post_id);
    const user_id = Number(res.locals.user.user_id);

    const result = await postLike(post_id, user_id);
    if (result === null) {
      throw new CustomError('Failed to add like', 500);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const likeDelete = async (
  req: Request<{post_id: string}>,
  res: Response<{message: string}>,
  next: NextFunction
) => {
  try {
    const post_id = Number(req.params.post_id);
    const user_id = Number(res.locals.user.user_id);

    const result = await deleteLike(post_id, user_id);
    if (result === null) {
      throw new CustomError('Failed to delete like', 500);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const likeGet = async (
  req: Request<{post_id: string}>,
  res: Response<{count: number}>,
  next: NextFunction
) => {
  try {
    const post_id = Number(req.params.post_id);

    const result = await getCountByMediaId(post_id);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {likePost, likeDelete, likeGet};

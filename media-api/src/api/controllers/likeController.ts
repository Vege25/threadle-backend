import {Request, Response, NextFunction} from 'express';
import {
  postLike,
  getUserLike,
  getCountByMediaId,
  deleteLike,
  getUserSaves,
} from '../models/likeModel';
import CustomError from '../../classes/CustomError';
import {postNotification} from '../models/notificationModel';
import {fetchMediaById} from '../models/mediaModel';
import {MediaItemWithOwner, PostItem, Save} from '@sharedTypes/DBTypes';

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

    const post = await fetchMediaById(post_id);
    if (post === null) {
      const error = new CustomError('Post not found', 404);
      next(error);
      return;
    }

    const postOwnerId = post.user_id;

    // Add notification
    try {
      await postNotification(postOwnerId, 'Someone saved your post');
    } catch (notificationError) {
      const error = new CustomError('Notification not added', 500);
      res.json(result);
      next(error);
      return;
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
const userLikeGet = async (
  req: Request<{post_id: string}>,
  res: Response<Save | null>,
  next: NextFunction
) => {
  try {
    const post_id = Number(req.params.post_id);
    const user_id = Number(res.locals.user.user_id);

    const save = await getUserLike(post_id, user_id);

    if (save === null) {
      res.json(null);
      return;
    }

    res.json(save);
  } catch (error) {
    next(error);
  }
};

const userSaveGet = async (
  req: Request<{user_id: string}>,
  res: Response<PostItem[] | null>,
  next: NextFunction
) => {
  try {
    const user_id = Number(res.locals.user.user_id);

    const saves = await getUserSaves(user_id);

    // fetch media items
    let postItems: PostItem[] = [];
    for (const save of saves) {
      const postItemResponse = await fetchMediaById(save.post_id);
      if (postItemResponse !== null) {
        postItems.push(postItemResponse);
      }
    }
    if (postItems.length === 0) {
      res.json(null);
      return;
    }

    res.json(postItems);
  } catch (error) {
    next(error);
  }
};

export {likePost, likeDelete, likeGet, userLikeGet, userSaveGet};

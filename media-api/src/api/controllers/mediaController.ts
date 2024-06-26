import {Request, Response, NextFunction} from 'express';
import {
  deleteMedia,
  fetchAllMedia,
  fetchAllMediaByUserId,
  fetchHighlightMediaById,
  fetchMediaById,
  highlightMediaPut,
  postMedia,
} from '../models/mediaModel';
import CustomError from '../../classes/CustomError';
import {MediaResponse, MessageResponse} from '@sharedTypes/MessageTypes';
import {PostItem, TokenContent} from '@sharedTypes/DBTypes';

const mediaListGet = async (
  req: Request,
  res: Response<PostItem[]>,
  next: NextFunction
) => {
  try {
    const media = await fetchAllMedia();
    if (media === null) {
      const error = new CustomError('No media found', 404);
      next(error);
      return;
    }
    res.json(media);
  } catch (error) {
    next(error);
  }
};

const mediaGet = async (
  req: Request<{id: string}>,
  res: Response<PostItem>,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const media = await fetchMediaById(id);
    if (media === null) {
      const error = new CustomError('No media found', 404);
      next(error);
      return;
    }
    res.json(media);
  } catch (error) {
    next(error);
  }
};
const highlightMediaGet = async (
  req: Request<{id: string}>,
  res: Response<PostItem>,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const media = await fetchHighlightMediaById(id);
    if (media === null) {
      const error = new CustomError('No highlight found for this user', 404);
      next(error);
      return;
    }
    res.json(media);
  } catch (error) {
    next(error);
  }
};

const mediaPost = async (
  req: Request<{}, {}, Omit<PostItem, 'post_id' | 'created_at'>>,
  res: Response<MediaResponse, {user: TokenContent}>,
  next: NextFunction
) => {
  try {
    // add user_id to media object from token
    req.body.user_id = res.locals.user.user_id;
    console.log(req.body);
    const newMedia = await postMedia(req.body);
    if (newMedia === null) {
      const error = new CustomError('Media not created', 500);
      next(error);
      return;
    }
    res.json({message: 'Media created', media: newMedia});
  } catch (error) {
    next(error);
  }
};
const highlightMedia = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const post_id = Number(req.params.id);
    const user_id = Number(res.locals.user.user_id);
    console.log('highlightMedia', user_id, post_id);

    const highlightMediaRes = await highlightMediaPut(post_id, user_id);
    console.log('highlightMediaRes', highlightMediaRes);
    if (highlightMediaRes === null) {
      const error = new CustomError('Media not highlighted', 500);
      next(error);
      return;
    }
    res.json({message: 'Media highlighted'});
  } catch (error) {
    next(error);
  }
};

const mediaDelete = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse, {user: TokenContent; token: string}>,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteMedia(id, res.locals.user, res.locals.token);
    if (result === null) {
      const error = new CustomError('Media not deleted', 500);
      next(error);
      return;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const mediaListGetByUserId = async (
  req: Request<{id: string}>,
  res: Response<PostItem[]>,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const media = await fetchAllMediaByUserId(id);
    if (media === null) {
      const error = new CustomError('No media found', 404);
      next(error);
      return;
    }
    res.json(media);
  } catch (error) {
    next(error);
  }
};

export {
  mediaListGet,
  highlightMediaGet,
  mediaGet,
  mediaPost,
  mediaDelete,
  mediaListGetByUserId,
  highlightMedia,
};

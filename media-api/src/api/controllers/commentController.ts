import {NextFunction, Request, Response} from 'express';
import {
  deleteComment,
  fetchAllComments,
  fetchCommentById,
  postComment,
  postCommentReply,
} from '../models/commentModel';
import CustomError from '../../classes/CustomError';
import {Comment, TokenContent, UserLevel} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {MediaResponse, MessageResponse} from '@sharedTypes/MessageTypes';
import {postNotification} from '../models/notificationModel';
import {mediaGet} from './mediaController';
import {fetchMediaById} from '../models/mediaModel';

const commentListGet = async (
  req: Request,
  res: Response<Comment[]>,
  next: NextFunction
) => {
  try {
    const comment = await fetchAllComments();
    if (comment === null) {
      const error = new CustomError('No media found', 404);
      next(error);
      return;
    }
    res.json(comment);
  } catch (error) {
    next(error);
  }
};
const commentPost = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const user_id = Number(res.locals.user.user_id);
    const post_id = Number(req.params.id);
    const comment_text = String(req.body.comment_text);

    const newComment = await postComment(post_id, user_id, comment_text);

    if (newComment === null) {
      const error = new CustomError('Comment not added', 500);
      next(error);
      return;
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
      await postNotification(postOwnerId, 'New Comment on your post');
    } catch (notificationError) {
      const error = new CustomError('Notification not added', 500);
      next(error);
      return;
    }

    res.json(newComment);
  } catch (error) {
    next(error);
  }
};

const commentReplyPost = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    // add user_id to media object from token
    const user_id = Number(res.locals.user.user_id);
    const comment_id = Number(req.params.id);
    const comment_text = String(req.body.comment_text);

    const newComment = await postCommentReply(
      comment_id,
      user_id,
      comment_text
    );

    if (newComment === null) {
      const error = new CustomError('Comment reply not added', 500);
      next(error);
      return;
    }

    res.json(newComment);
  } catch (error) {
    next(error);
  }
};
const commentDelete = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const user_id = Number(res.locals.user.user_id);
    const user_level: UserLevel['level_name'] = res.locals.user.level_name;

    const result = await deleteComment(id, user_id, user_level);
    if (result === null) {
      const error = new CustomError('Comment not deleted', 500);
      next(error);
      return;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {commentListGet, commentReplyPost, commentPost, commentDelete};

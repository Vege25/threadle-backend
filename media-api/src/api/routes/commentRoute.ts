import express from 'express';
import {authenticate} from '../../middlewares';
import {
  commentDelete,
  commentListGet,
  commentPost,
  commentReplyPost,
} from '../controllers/commentController';
import {postComment} from '../models/commentModel';

const router = express.Router();

router.route('/').get(commentListGet);

router
  .route('/:id')
  .post(authenticate, commentPost)
  .delete(authenticate, commentDelete); // Delete not working, affectedrows in comments delete is 0

router.route('/reply/:id').post(authenticate, commentReplyPost);

export default router;

commentListGet;

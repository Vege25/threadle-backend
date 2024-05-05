import express from 'express';
import {authenticate} from '../../middlewares';
import {
  likePost,
  likeDelete,
  likeGet,
  userLikeGet,
  userSaveGet,
} from '../controllers/likeController';

const router = express.Router();

router.get('/', authenticate, userSaveGet);
router.post('/:post_id', authenticate, likePost);
router.delete('/:post_id', authenticate, likeDelete);
router.get('/:post_id', likeGet);
router.get('/userLike/:post_id', authenticate, userLikeGet);

export default router;

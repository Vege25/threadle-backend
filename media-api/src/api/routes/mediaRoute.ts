import express from 'express';
import {
  mediaDelete,
  mediaGet,
  mediaListGet,
  mediaPost,
} from '../controllers/mediaController';
import {authenticate} from '../../middlewares';

const router = express.Router();

router.route('/').get(mediaListGet).post(authenticate, mediaPost);

router.route('/:id').get(mediaGet).delete(authenticate, mediaDelete);

export default router;

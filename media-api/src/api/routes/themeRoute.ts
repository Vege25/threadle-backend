import express from 'express';
import {authenticate} from '../../middlewares';
import {
  themeListGet,
  themeListGetByUserId,
  themePost,
} from '../controllers/themeController';

const router = express.Router();

router.route('/').get(themeListGet).post(authenticate, themePost);

router.route('/:id').get(themeListGetByUserId);

export default router;

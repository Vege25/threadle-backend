import express from 'express';
import {
  tagListGet,
  tagMediaGet,
  mediaTagsGet,
  tagPost,
  tagDelete,
} from '../controllers/tagController';
import {authenticate} from '../../middlewares';

const router = express.Router();

router.route('/').get(tagListGet).post(authenticate, tagPost);

router.route('/:id').delete(authenticate, tagDelete);
router.route('/:tag').get(tagMediaGet);

router.route('/media/:id').get(mediaTagsGet);

export default router;

import express from 'express';
import {
  chatMessagePost,
  createChat,
  getAllMyChats,
  messagesByChatId,
  resetChat,
} from '../controllers/chatController';
import {authenticate} from '../../middlewares';

const router = express.Router();

// router.get('/getMyChats', authenticate, myChatsById);
router.post('/:id', authenticate, createChat);
router.get('/', authenticate, getAllMyChats);
router.get('/message/:id', messagesByChatId);
router.post('/message/:id', authenticate, chatMessagePost);
router.delete('/', resetChat);

export default router;

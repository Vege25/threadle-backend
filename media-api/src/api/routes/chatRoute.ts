import express from 'express';
import {
  chatMessagePost,
  createChat,
  getAllMyChats,
  messagesByChatId,
  resetChat,
} from '../controllers/chatController';
import {authenticate} from '../../middlewares';

/**
 * @api {post} /chats/:id Create Chat
 * @apiName CreateChat
 * @apiGroup Chats
 *
 * @apiDescription Create a new chat conversation.
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiParam {Number} id Receiver user's ID to create the chat with.
 *
 * @apiSuccess {String} message Message indicating the chat creation.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Chat created"
 *     }
 */

/**
 * @api {get} /chats Get All My Chats
 * @apiName GetAllMyChats
 * @apiGroup Chats
 *
 * @apiDescription Get a list of all chats for the authenticated user.
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiSuccess {Number} chat_id Chat's unique ID.
 * @apiSuccess {Number} sender_id Sender user's ID.
 * @apiSuccess {Number} receiver_id Receiver user's ID.
 * @apiSuccess {String} created_at Time when the chat was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "chat_id": 1,
 *         "sender_id": 123,
 *         "receiver_id": 456,
 *         "created_at": "2024-04-14T12:00:00Z"
 *       },
 *       {
 *         "chat_id": 2,
 *         "sender_id": 789,
 *         "receiver_id": 101,
 *         "created_at": "2024-04-14T12:30:00Z"
 *       }
 *     ]
 */

/**
 * @api {get} /chats/message/:id Get Messages by Chat ID
 * @apiName GetMessagesByChatId
 * @apiGroup Chats
 *
 * @apiDescription Get messages of a chat by its ID.
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiParam {Number} id Chat ID to get messages from.
 *
 * @apiSuccess {Number} message_id Message's unique ID.
 * @apiSuccess {Number} chat_id Chat's unique ID associated with the message.
 * @apiSuccess {Number} sender_id Sender user's ID.
 * @apiSuccess {Number} receiver_id Receiver user's ID.
 * @apiSuccess {String} message Message content.
 * @apiSuccess {String} created_at Time when the message was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "message_id": 1,
 *         "chat_id": 123,
 *         "sender_id": 456,
 *         "receiver_id": 789,
 *         "message": "Hello, how are you?",
 *         "created_at": "2024-04-14T12:00:00Z"
 *       },
 *       {
 *         "message_id": 2,
 *         "chat_id": 123,
 *         "sender_id": 789,
 *         "receiver_id": 456,
 *         "message": "I'm good, thank you!",
 *         "created_at": "2024-04-14T12:30:00Z"
 *       }
 *     ]
 */

/**
 * @api {post} /chats/message/:id Create Chat Message
 * @apiName CreateChatMessage
 * @apiGroup Chats
 *
 * @apiDescription Create a new message in a chat.
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiParam {Number} id Chat ID to send the message to.
 * @apiParam {String} message Message content to send.
 *
 * @apiSuccess {String} message Message indicating the message creation.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Message sent"
 *     }
 */

/**
 * @api {delete} /chats Reset Chat
 * @apiName ResetChat
 * @apiGroup Chats
 *
 * @apiDescription Reset the chat messages (for testing purposes).
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiSuccess {String} message Message indicating the chat reset.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Chat reset successful"
 *     }
 */

const router = express.Router();

// router.get('/getMyChats', authenticate, myChatsById);
router.post('/:id', authenticate, createChat);
router.get('/', authenticate, getAllMyChats);
router.get('/message/:id', messagesByChatId);
router.post('/message/:id', authenticate, chatMessagePost);
router.delete('/', resetChat);

export default router;

import {NextFunction, Request, Response} from 'express';
import {
  addChat,
  addChatMessage,
  getChatBySenderReceiver,
  getChatMessagesByChatId,
  getMyChats,
  resetMessages,
} from '../models/chatModel';
import {validationResult} from 'express-validator';
import {ChatResponse, MessageResponse} from '@sharedTypes/MessageTypes';
import {ChatMessages, Chats, UserWithNoPassword} from '@sharedTypes/DBTypes';
import CustomError from '../../classes/CustomError';
import {postNotification} from '../models/notificationModel';

const messagesByChatId = async (
  req: Request<{id: string}>,
  res: Response<ChatMessages[]>,
  next: NextFunction
) => {
  try {
    const chat_id = Number(req.params.id);
    const chats = await getChatMessagesByChatId(chat_id);
    if (chats === null) {
      next(new CustomError('Chats not found', 404));
      return;
    }

    res.json(chats);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const chatMessagePost = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('chatPost validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const user: UserWithNoPassword = res.locals.user;
    const message: string | undefined = req.body.message;
    const sender_id = req.body.sender_id;
    const receiver_id = req.body.receiver_id;
    const chat_id = Number(req.params.id);

    if (!user) {
      next(new CustomError('User not found', 404));
      return;
    }
    if (!chat_id) {
      next(new CustomError('Chat not found', 404));
      return;
    }
    if (!message) {
      next(new CustomError('Message not found', 404));
      return;
    }

    // Add chat message to chat
    const messageRes = await addChatMessage(
      chat_id,
      sender_id,
      receiver_id,
      message
    );
    if (!messageRes) {
      next(new CustomError('Chat message not added', 500));
      return;
    }
    console.log('chat Added', messageRes);

    // add notification
    // Send notification to the other user_id
    const userIdToSendNotif =
      user.user_id === sender_id ? receiver_id : sender_id;

    const notificationRes = postNotification(
      userIdToSendNotif,
      'New Chat message'
    );

    if (!notificationRes) {
      next(new CustomError('Notification not added', 500));
      res.json(messageRes);
      return;
    }
    res.json(messageRes);
  } catch (error) {
    next(new CustomError('Duplicate entry', 200));
  }
};
const getAllMyChats = async (
  req: Request,
  res: Response<Chats[]>,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (!user) {
      next(new CustomError('User not found', 404));
      return;
    }
    const chats = await getMyChats(user.user_id);
    if (chats === null) {
      next(new CustomError('Chats not found', 404));
      return;
    }

    res.json(chats);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const createChat = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const sender = res.locals.user;
    const receiver_id = Number(req.params.id);

    if (!sender) {
      next(new CustomError('Sender user not found', 404));
      return;
    }
    if (!receiver_id) {
      next(new CustomError('Receiver user not found', 404));
      return;
    }
    if (Number(sender.user_id) === receiver_id) {
      next(new CustomError('Cannot create chat with yourself', 400));
      return;
    }

    // Check if chat already exists
    const existingChat = await getChatBySenderReceiver(
      Number(sender.user_id),
      receiver_id
    );
    if (existingChat) {
      next(new CustomError('Chat already exists', 400));
      return;
    }

    // Create chat conversation
    const messageRes = await addChat(Number(sender.user_id), receiver_id);
    if (!messageRes) {
      next(new CustomError('Chat message not added', 500));
      return;
    }
    console.log('chat Added', messageRes);
    res.json(messageRes);
  } catch (error) {
    next(new CustomError('Duplicate entry', 200));
  }
};
const resetChat = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const messageRes = await resetMessages();
    if (!messageRes) {
      next(new CustomError('Chat reset failed', 500));
      return;
    }
    res.json(messageRes);
  } catch (error) {
    next(new CustomError('Chat reset failed', 200));
  }
};

export {
  chatMessagePost,
  messagesByChatId,
  resetChat,
  createChat,
  getAllMyChats,
};

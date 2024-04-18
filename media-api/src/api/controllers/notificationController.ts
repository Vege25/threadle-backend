import {NextFunction, Request, Response} from 'express';
import CustomError from '../../classes/CustomError';
import {
  fetchAllNotifications,
  notificationPut,
  postNotification,
} from '../models/notificationModel';
import {MessageResponse} from '@sharedTypes/MessageTypes';
import {Notification} from '@sharedTypes/DBTypes';

const notificationListGet = async (
  req: Request,
  res: Response<Notification[]>,
  next: NextFunction
) => {
  try {
    const user_id = res.locals.user.user_id;
    const tags = await fetchAllNotifications(user_id);
    if (tags === null) {
      const error = new CustomError('No notifications found', 404);
      next(error);
      return;
    }
    res.json(tags);
  } catch (error) {
    next(error);
  }
};

const putNotification = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const user_id = Number(res.locals.user.user_id);
    const notification_id = Number(req.params.id);

    const result = await notificationPut(user_id, notification_id);

    if (result === null) {
      const error = new CustomError('Notification viewed failed', 500);
      next(error);
      return;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};
export {notificationListGet, putNotification};

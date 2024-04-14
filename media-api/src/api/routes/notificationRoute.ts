import express from 'express';
import {authenticate} from '../../middlewares';
import {
  notificationListGet,
  putNotification,
} from '../controllers/notificationController';

const router = express.Router();
/**
 * @api {get} /notifications List Notifications
 * @apiName ListNotifications
 * @apiGroup Notifications
 *
 * @apiDescription Get all notifications for the authenticated user.
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiSuccess {Number} notification_id Notification's unique ID.
 * @apiSuccess {Number} user_id User's unique ID associated with the notification.
 * @apiSuccess {String} message Notification message.
 * @apiSuccess {String} viewed Indicates if the notification has been viewed (yes/no).
 * @apiSuccess {String} created_at Time when the notification was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "notification_id": 1,
 *         "user_id": 123,
 *         "message": "New message received",
 *         "viewed": "no",
 *         "created_at": "2024-04-14T12:00:00Z"
 *       },
 *       {
 *         "notification_id": 2,
 *         "user_id": 123,
 *         "message": "Post commented on",
 *         "viewed": "yes",
 *         "created_at": "2024-04-14T11:30:00Z"
 *       }
 *     ]
 */

/**
 * @api {put} /notifications/:id Mark Notification as Viewed
 * @apiName MarkNotificationViewed
 * @apiGroup Notifications
 *
 * @apiDescription Mark a notification as viewed.
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiParam {String} id Notification ID to mark as viewed.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Notification viewed successfully"
 *     }
 */

router.route('/').get(authenticate, notificationListGet);
router.route('/:id').put(authenticate, putNotification);

export default router;

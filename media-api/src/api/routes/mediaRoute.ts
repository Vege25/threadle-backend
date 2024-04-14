import express from 'express';
import {
  mediaDelete,
  mediaGet,
  mediaListGet,
  mediaListGetByUserId,
  mediaPost,
} from '../controllers/mediaController';
import {authenticate} from '../../middlewares';

/**
 * @api {get} /media Get All Media
 * @apiName GetAllMedia
 * @apiGroup Media
 *
 * @apiDescription Get a list of all media.
 *
 * @apiSuccess {Number} post_id Media's unique ID.
 * @apiSuccess {Number} user_id User's unique ID associated with the media.
 * @apiSuccess {String} filename Name of the media file.
 * @apiSuccess {Number} filesize Size of the media file in bytes.
 * @apiSuccess {String} media_type Type of the media (e.g., image/jpeg, video/mp4).
 * @apiSuccess {String} title Title of the media.
 * @apiSuccess {String} description Description of the media.
 * @apiSuccess {String} created_at Time when the media was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "post_id": 1,
 *         "user_id": 123,
 *         "filename": "example.jpg",
 *         "filesize": 1024,
 *         "media_type": "image/jpeg",
 *         "title": "Example Image",
 *         "description": "This is an example image",
 *         "created_at": "2024-04-14T12:00:00Z"
 *       },
 *       {
 *         "post_id": 2,
 *         "user_id": 456,
 *         "filename": "example.mp4",
 *         "filesize": 20480,
 *         "media_type": "video/mp4",
 *         "title": "Example Video",
 *         "description": "This is an example video",
 *         "created_at": "2024-04-14T12:30:00Z"
 *       }
 *     ]
 */

/**
 * @api {get} /media/:id Get Media by ID
 * @apiName GetMediaById
 * @apiGroup Media
 *
 * @apiDescription Get media by its ID.
 *
 * @apiParam {Number} id Media ID to get the media for.
 *
 * @apiSuccess {Number} post_id Media's unique ID.
 * @apiSuccess {Number} user_id User's unique ID associated with the media.
 * @apiSuccess {String} filename Name of the media file.
 * @apiSuccess {Number} filesize Size of the media file in bytes.
 * @apiSuccess {String} media_type Type of the media (e.g., image/jpeg, video/mp4).
 * @apiSuccess {String} title Title of the media.
 * @apiSuccess {String} description Description of the media.
 * @apiSuccess {String} created_at Time when the media was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "post_id": 1,
 *       "user_id": 123,
 *       "filename": "example.jpg",
 *       "filesize": 1024,
 *       "media_type": "image/jpeg",
 *       "title": "Example Image",
 *       "description": "This is an example image",
 *       "created_at": "2024-04-14T12:00:00Z"
 *     }
 */

/**
 * @api {post} /media Create Media
 * @apiName CreateMedia
 * @apiGroup Media
 *
 * @apiDescription Create a new media object.
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiParam {String} filename Name of the media file.
 * @apiParam {Number} filesize Size of the media file in bytes.
 * @apiParam {String} media_type Type of the media (e.g., image/jpeg, video/mp4).
 * @apiParam {String} title Title of the media.
 * @apiParam {String} [description] Description of the media (optional).
 *
 * @apiSuccess {String} message Message indicating the media creation.
 * @apiSuccess {Object} media Media object.
 * @apiSuccess {Number} media.post_id Media's unique ID.
 * @apiSuccess {Number} media.user_id User's unique ID associated with the media.
 * @apiSuccess {String} media.filename Name of the media file.
 * @apiSuccess {Number} media.filesize Size of the media file in bytes.
 * @apiSuccess {String} media.media_type Type of the media (e.g., image/jpeg, video/mp4).
 * @apiSuccess {String} media.title Title of the media.
 * @apiSuccess {String} media.description Description of the media.
 * @apiSuccess {String} media.created_at Time when the media was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Media created",
 *       "media": {
 *         "post_id": 1,
 *         "user_id": 123,
 *         "filename": "example.jpg",
 *         "filesize": 1024,
 *         "media_type": "image/jpeg",
 *         "title": "Example Image",
 *         "description": "This is an example image",
 *         "created_at": "2024-04-14T12:00:00Z"
 *       }
 *     }
 */

/**
 * @api {delete} /media/:id Delete Media
 * @apiName DeleteMedia
 * @apiGroup Media
 *
 * @apiDescription Delete a media object by its ID.
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiParam {Number} id Media ID to delete the media.
 *
 * @apiSuccess {String} message Message indicating the media deletion.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Media deleted"
 *     }
 */

/**
 * @api {get} /media/all/:id Get All Media By User ID
 * @apiName GetAllMediaByUserId
 * @apiGroup Media
 *
 * @apiDescription Get all media associated with a specific user ID.
 *
 * @apiParam {Number} id User ID to get all media for.
 *
 * @apiSuccess {Number} post_id Media's unique ID.
 * @apiSuccess {Number} user_id User's unique ID associated with the media.
 * @apiSuccess {String} filename Name of the media file.
 * @apiSuccess {Number} filesize Size of the media file in bytes.
 * @apiSuccess {String} media_type Type of the media (e.g., image/jpeg, video/mp4).
 * @apiSuccess {String} title Title of the media.
 * @apiSuccess {String} description Description of the media.
 * @apiSuccess {String} created_at Time when the media was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "post_id": 1,
 *         "user_id": 123,
 *         "filename": "example.jpg",
 *         "filesize": 1024,
 *         "media_type": "image/jpeg",
 *         "title": "Example Image",
 *         "description": "This is an example image",
 *         "created_at": "2024-04-14T12:00:00Z"
 *       },
 *       {
 *         "post_id": 2,
 *         "user_id": 123,
 *         "filename": "example.mp4",
 *         "filesize": 20480,
 *         "media_type": "video/mp4",
 *         "title": "Example Video",
 *         "description": "This is an example video",
 *         "created_at": "2024-04-14T12:30:00Z"
 *       }
 *     ]
 */

const router = express.Router();

router.route('/').get(mediaListGet).post(authenticate, mediaPost);
router.route('/all/:id').get(mediaListGetByUserId);
router.route('/:id').get(mediaGet).delete(authenticate, mediaDelete);

export default router;

import express from 'express';
import {authenticate} from '../../middlewares';
import {
  friendAcceptPut,
  friendDelete,
  friendRequest,
  friendsGet,
  pendingFriendsGet,
} from '../controllers/friendController';

const router = express.Router();

/**
 * @api {get} /friends Get User List
 * @apiName friendsGet
 * @apiGroup Friends
 *
 * @apiSuccess {Object[]} users List of users.
 * @apiSuccess {Number} users.user_id User's unique ID.
 * @apiSuccess {String} users.username User's username.
 * @apiSuccess {String} users.email User's email.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
            "user_id": 3,
            "username": "Anon5468",
            "email": "anon5468@example.com"
          },
          {
            "user_id": 2,
            "username": "JaneSmith",
            "email": "janesmith@example.com"
          }
 *     ]
 */
router.get('/', authenticate, friendsGet);

/**
           * @api {get} /friends/pending Get User's friend requests list
           * @apiName pendingFriendsGet
           * @apiGroup Friends
           *
           * @apiSuccess {Object[]} users List of users.
           * @apiSuccess {Number} users.user_id User's unique ID.
           * @apiSuccess {String} users.username User's username.
           * @apiSuccess {String} users.email User's email.
           *
           * @apiSuccessExample {json} Success-Response:
           *     HTTP/1.1 200 OK
           *     [
           *       {
                    "user_id": 2,
                    "username": "JaneSmith",
                    "email": "janesmith@example.com"
                  }
           *     ]
           */
router.get('/pending', authenticate, pendingFriendsGet);
/**
 * @api {delete} /friends/:id Delete Friendship
 * @apiName friendDelete
 * @apiGroup Friends
 * @apiPermission Bearer Token
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} user User's information.
 * @apiSuccess {Number} user_id User's id that connection was removed.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "message": "Friendship removed",
          "user": {
            "user_id": 3
          }
 *     }
 */
router.delete('/:id', authenticate, friendDelete);

/**
           * @api {post} /friends/:id Delete Friendship
           * @apiName friendDelete
           * @apiGroup Friends
           * @apiPermission Bearer Token
           *
           * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
           *
           * @apiSuccess {String} message Success message.
           * @apiSuccess {Object} user User's information.
           * @apiSuccess {Number} user_id User's id that connection was removed.
           *
           * @apiSuccessExample {json} Success-Response:
           *     HTTP/1.1 200 OK
           *     {
           *        "message": "Friendship added",
                    "user": {
                      "user_id": 3
                    }
           *     }
           */
router.post('/:id', authenticate, friendRequest);

/**
 * @api {put} /acceptFriend/:id Update User's friend requests to accepted
 * @apiName friendAcceptGet
 * @apiGroup Friends
 *
 * @apiPermission Bearer Token
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiSuccess {String} message Message of the request.
 * @apiSuccess {Object} user User object.
 * @apiSuccess {Number} users.user_id User's unique ID.
 * @apiSuccess {String} users.username User's username.
 * @apiSuccess {String} users.email User's email.
 * @apiSuccess {String} users.created_at Time when user has been created.
 * @apiSuccess {String} users.level_name Users level
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *        "message": "Friend request accepted",
          "user": {
            "user_id": 3,
            "username": "Anon5468",
            "email": "anon5468@example.com",
            "created_at": "2024-01-17T12:46:39.000Z",
            "level_name": "User"
          }
 *     ]
 */
router.put('/:id', authenticate, friendAcceptPut);

export default router;

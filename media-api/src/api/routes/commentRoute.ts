import express from 'express';
import {authenticate} from '../../middlewares';
import {
  commentDelete,
  commentListGet,
  commentPost,
  commentReplyPost,
} from '../controllers/commentController';
import {postComment} from '../models/commentModel';

/**
 * @api {get} /comments Get All Comments
 * @apiName GetAllComments
 * @apiGroup Comments
 *
 * @apiDescription Get a list of all comments.
 *
 * @apiSuccess {Number} comment_id Comment's unique ID.
 * @apiSuccess {Number} post_id Post's unique ID associated with the comment.
 * @apiSuccess {Number} user_id User's unique ID who posted the comment.
 * @apiSuccess {String} comment_text Text of the comment.
 * @apiSuccess {String} created_at Time when the comment was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "comment_id": 1,
 *         "post_id": 123,
 *         "user_id": 456,
 *         "comment_text": "This is a comment",
 *         "created_at": "2024-04-14T12:00:00Z"
 *       },
 *       {
 *         "comment_id": 2,
 *         "post_id": 789,
 *         "user_id": 101,
 *         "comment_text": "Another comment",
 *         "created_at": "2024-04-14T12:30:00Z"
 *       }
 *     ]
 */

/**
 * @api {post} /comments/:id Create Comment
 * @apiName CreateComment
 * @apiGroup Comments
 *
 * @apiDescription Create a new comment on a post.
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiParam {String} comment_text Text of the comment.
 * @apiParam {Number} id Post ID to create the comment for.
 *
 * @apiSuccess {String} message Message indicating the comment creation.
 * @apiSuccess {Object} comment Comment object.
 * @apiSuccess {Number} comment.comment_id Comment's unique ID.
 * @apiSuccess {Number} comment.post_id Post's unique ID associated with the comment.
 * @apiSuccess {Number} comment.user_id User's unique ID who posted the comment.
 * @apiSuccess {String} comment.comment_text Text of the comment.
 * @apiSuccess {String} comment.created_at Time when the comment was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Comment added",
 *       "comment": {
 *         "comment_id": 1,
 *         "post_id": 123,
 *         "user_id": 456,
 *         "comment_text": "This is a comment",
 *         "created_at": "2024-04-14T12:00:00Z"
 *       }
 *     }
 */

/**
 * @api {delete} /comments/:id Delete Comment
 * @apiName DeleteComment
 * @apiGroup Comments
 *
 * @apiDescription Delete a comment by its ID.
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiParam {Number} id Comment ID to delete the comment.
 *
 * @apiSuccess {String} message Message indicating the comment deletion.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Comment deleted"
 *     }
 */

/**
 * @api {post} /comments/reply/:id Create Comment Reply
 * @apiName CreateCommentReply
 * @apiGroup Comments
 *
 * @apiDescription Create a reply to a comment.
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiParam {String} comment_text Text of the comment reply.
 * @apiParam {Number} id Comment ID to reply to.
 *
 * @apiSuccess {String} message Message indicating the comment reply creation.
 * @apiSuccess {Object} comment Comment reply object.
 * @apiSuccess {Number} comment.comment_id Comment's unique ID.
 * @apiSuccess {Number} comment.parent_comment_id Parent comment's ID to which the reply belongs.
 * @apiSuccess {Number} comment.user_id User's unique ID who posted the reply.
 * @apiSuccess {String} comment.comment_text Text of the reply.
 * @apiSuccess {String} comment.created_at Time when the reply was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Comment reply added",
 *       "comment": {
 *         "comment_id": 1,
 *         "parent_comment_id": 123,
 *         "user_id": 456,
 *         "comment_text": "This is a reply",
 *         "created_at": "2024-04-14T12:00:00Z"
 *       }
 *     }
 */

const router = express.Router();

router.route('/').get(commentListGet);

router
  .route('/:id')
  .post(authenticate, commentPost)
  .delete(authenticate, commentDelete); // Delete not working, affectedrows in comments delete is 0

router.route('/reply/:id').post(authenticate, commentReplyPost);

export default router;

commentListGet;
